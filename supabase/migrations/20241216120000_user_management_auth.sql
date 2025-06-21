-- supabase/migrations/20241216120000_user_management_auth.sql

-- User Management Module with Authentication and Permissions
-- IMPLEMENTING MODULE: User Management & Authentication

-- Step 1: Create Types
CREATE TYPE public.user_role AS ENUM ('admin', 'manager', 'usher', 'attendee');
CREATE TYPE public.permission_type AS ENUM (
  'create_events',
  'edit_events', 
  'delete_events',
  'manage_users',
  'manage_permissions',
  'view_analytics',
  'check_in_attendees',
  'export_data',
  'send_notifications'
);
CREATE TYPE public.event_status AS ENUM ('draft', 'published', 'cancelled', 'completed');
CREATE TYPE public.event_category AS ENUM ('technology', 'business', 'creative', 'healthcare', 'education', 'sports', 'entertainment', 'other');

-- Step 2: Core Tables
-- User profiles table (intermediary for auth relationships)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'attendee'::public.user_role,
    phone TEXT,
    avatar_url TEXT,
    timezone TEXT DEFAULT 'Africa/Cairo',
    preferred_currency TEXT DEFAULT 'EGP',
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Role permissions mapping table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    role public.user_role NOT NULL,
    permission public.permission_type NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(role, permission)
);

-- User-specific permissions (overrides role permissions)
CREATE TABLE public.user_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    permission public.permission_type NOT NULL,
    granted BOOLEAN DEFAULT true,
    granted_by UUID REFERENCES public.user_profiles(id),
    granted_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, permission)
);

-- Events table (references user_profiles)
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    description TEXT,
    category public.event_category DEFAULT 'other'::public.event_category,
    status public.event_status DEFAULT 'draft'::public.event_status,
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ,
    location TEXT,
    capacity INTEGER,
    price_egp DECIMAL(10,2) DEFAULT 0,
    currency TEXT DEFAULT 'EGP',
    timezone TEXT DEFAULT 'Africa/Cairo',
    image_url TEXT,
    created_by UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Event registrations
CREATE TABLE public.event_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    registration_date TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    checked_in BOOLEAN DEFAULT false,
    checked_in_at TIMESTAMPTZ,
    checked_in_by UUID REFERENCES public.user_profiles(id),
    qr_code TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(event_id, user_id)
);

-- Step 3: Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_role_permissions_role ON public.role_permissions(role);
CREATE INDEX idx_user_permissions_user_id ON public.user_permissions(user_id);
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_start_date ON public.events(start_date);
CREATE INDEX idx_registrations_event_id ON public.event_registrations(event_id);
CREATE INDEX idx_registrations_user_id ON public.event_registrations(user_id);
CREATE INDEX idx_registrations_qr_code ON public.event_registrations(qr_code);

-- Step 4: Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_registrations ENABLE ROW LEVEL SECURITY;

-- Step 5: Helper Functions
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = 'admin'::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.has_role(required_role TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.user_profiles up
    WHERE up.id = auth.uid() AND up.role = required_role::public.user_role
)
$$;

CREATE OR REPLACE FUNCTION public.has_permission(permission_name TEXT)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    -- Check role permissions
    SELECT 1 FROM public.user_profiles up
    JOIN public.role_permissions rp ON up.role = rp.role
    WHERE up.id = auth.uid() 
    AND rp.permission = permission_name::public.permission_type
) OR EXISTS (
    -- Check user-specific permissions (if granted and not expired)
    SELECT 1 FROM public.user_permissions uup
    WHERE uup.user_id = auth.uid()
    AND uup.permission = permission_name::public.permission_type
    AND uup.granted = true
    AND (uup.expires_at IS NULL OR uup.expires_at > CURRENT_TIMESTAMP)
)
$$;

CREATE OR REPLACE FUNCTION public.can_manage_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT (
    public.is_admin() OR
    public.has_permission('manage_users')
) AND target_user_id != auth.uid()
$$;

CREATE OR REPLACE FUNCTION public.can_access_event(event_uuid UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
AS $$
SELECT EXISTS (
    SELECT 1 FROM public.events e
    WHERE e.id = event_uuid AND (
        e.created_by = auth.uid() OR
        public.is_admin() OR
        public.has_permission('edit_events')
    )
)
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'attendee')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- Function to update user updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$;

-- Step 6: Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Step 7: RLS Policies
-- User profiles policies
CREATE POLICY "users_view_own_profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id OR public.is_admin());

CREATE POLICY "users_update_own_profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

CREATE POLICY "admins_manage_all_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Role permissions policies (read-only for authenticated users)
CREATE POLICY "authenticated_view_role_permissions"
ON public.role_permissions
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_manage_role_permissions"
ON public.role_permissions
FOR ALL
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- User permissions policies
CREATE POLICY "users_view_own_permissions"
ON public.user_permissions
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.has_permission('manage_permissions'));

CREATE POLICY "admins_manage_user_permissions"
ON public.user_permissions
FOR ALL
TO authenticated
USING (public.has_permission('manage_permissions'))
WITH CHECK (public.has_permission('manage_permissions'));

-- Events policies
CREATE POLICY "public_view_published_events"
ON public.events
FOR SELECT
TO public
USING (status = 'published'::public.event_status);

CREATE POLICY "authenticated_view_all_events"
ON public.events
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "creators_manage_own_events"
ON public.events
FOR ALL
TO authenticated
USING (created_by = auth.uid())
WITH CHECK (created_by = auth.uid());

CREATE POLICY "permitted_users_manage_events"
ON public.events
FOR ALL
TO authenticated
USING (public.has_permission('edit_events'))
WITH CHECK (public.has_permission('create_events'));

-- Event registrations policies
CREATE POLICY "users_view_own_registrations"
ON public.event_registrations
FOR SELECT
TO authenticated
USING (user_id = auth.uid() OR public.can_access_event(event_id));

CREATE POLICY "users_manage_own_registrations"
ON public.event_registrations
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

CREATE POLICY "ushers_checkin_attendees"
ON public.event_registrations
FOR UPDATE
TO authenticated
USING (
    public.has_role('usher') OR 
    public.has_permission('check_in_attendees') OR
    public.can_access_event(event_id)
)
WITH CHECK (
    public.has_role('usher') OR 
    public.has_permission('check_in_attendees') OR
    public.can_access_event(event_id)
);

-- Step 8: Default Role Permissions
INSERT INTO public.role_permissions (role, permission) VALUES
-- Admin permissions (all permissions)
('admin'::public.user_role, 'create_events'::public.permission_type),
('admin'::public.user_role, 'edit_events'::public.permission_type),
('admin'::public.user_role, 'delete_events'::public.permission_type),
('admin'::public.user_role, 'manage_users'::public.permission_type),
('admin'::public.user_role, 'manage_permissions'::public.permission_type),
('admin'::public.user_role, 'view_analytics'::public.permission_type),
('admin'::public.user_role, 'check_in_attendees'::public.permission_type),
('admin'::public.user_role, 'export_data'::public.permission_type),
('admin'::public.user_role, 'send_notifications'::public.permission_type),

-- Manager permissions
('manager'::public.user_role, 'create_events'::public.permission_type),
('manager'::public.user_role, 'edit_events'::public.permission_type),
('manager'::public.user_role, 'view_analytics'::public.permission_type),
('manager'::public.user_role, 'check_in_attendees'::public.permission_type),
('manager'::public.user_role, 'export_data'::public.permission_type),
('manager'::public.user_role, 'send_notifications'::public.permission_type),

-- Usher permissions
('usher'::public.user_role, 'check_in_attendees'::public.permission_type),

-- Attendee permissions (none by default)
ON CONFLICT (role, permission) DO NOTHING;

-- Step 9: Mock Data
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    manager_uuid UUID := gen_random_uuid();
    usher_uuid UUID := gen_random_uuid();
    attendee_uuid UUID := gen_random_uuid();
    event1_uuid UUID := gen_random_uuid();
    event2_uuid UUID := gen_random_uuid();
BEGIN
    -- Create auth users with all required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@eventflow.com', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Admin User", "role": "admin"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (manager_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'manager@eventflow.com', crypt('manager123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Event Manager", "role": "manager"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (usher_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'usher@eventflow.com', crypt('usher123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Event Usher", "role": "usher"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (attendee_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'attendee@eventflow.com', crypt('attendee123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "John Attendee", "role": "attendee"}'::jsonb, 
         '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Create sample events
    INSERT INTO public.events (id, name, description, category, status, start_date, end_date, location, capacity, price_egp, created_by) VALUES
        (event1_uuid, 'Tech Conference Cairo 2024', 
         'The largest technology conference in Egypt featuring AI, blockchain, and innovation talks.',
         'technology'::public.event_category, 'published'::public.event_status,
         '2024-04-15 09:00:00+02', '2024-04-15 17:00:00+02',
         'Cairo International Convention Center', 500, 250.00, admin_uuid),
        (event2_uuid, 'Digital Marketing Workshop', 
         'Learn modern digital marketing strategies and tools for Egyptian businesses.',
         'business'::public.event_category, 'published'::public.event_status,
         '2024-04-20 14:00:00+02', '2024-04-20 18:00:00+02',
         'New Administrative Capital', 150, 150.00, manager_uuid);

    -- Create sample registrations
    INSERT INTO public.event_registrations (event_id, user_id, qr_code) VALUES
        (event1_uuid, attendee_uuid, 'QR_' || attendee_uuid || '_' || event1_uuid),
        (event2_uuid, attendee_uuid, 'QR_' || attendee_uuid || '_' || event2_uuid),
        (event1_uuid, usher_uuid, 'QR_' || usher_uuid || '_' || event1_uuid);

    -- Grant special permission to usher for event management
    INSERT INTO public.user_permissions (user_id, permission, granted_by) VALUES
        (usher_uuid, 'view_analytics'::public.permission_type, admin_uuid);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error during mock data creation: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error during mock data creation: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error during mock data creation: %', SQLERRM;
END $$;

-- Cleanup function for development
CREATE OR REPLACE FUNCTION public.cleanup_test_data()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    auth_user_ids_to_delete UUID[];
BEGIN
    -- Get auth user IDs first
    SELECT ARRAY_AGG(id) INTO auth_user_ids_to_delete
    FROM auth.users
    WHERE email LIKE '%@eventflow.com';

    -- Delete in dependency order (children first, then auth.users last)
    DELETE FROM public.event_registrations WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.events WHERE created_by = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_permissions WHERE user_id = ANY(auth_user_ids_to_delete);
    DELETE FROM public.user_profiles WHERE id = ANY(auth_user_ids_to_delete);

    -- Delete auth.users last (after all references are removed)
    DELETE FROM auth.users WHERE id = ANY(auth_user_ids_to_delete);
EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key constraint prevents deletion: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Cleanup failed: %', SQLERRM;
END;
$$;