import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from 'components/AppIcon';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';

const LoginRegister = () => {
  const [activeTab, setActiveTab] = useState('login');
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-accent-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo/Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg">
              <Icon name="Calendar" size={28} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-text-primary">EventFlow</h1>
              <p className="text-sm text-text-secondary">Event Management System</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-surface rounded-2xl shadow-lg border border-border overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex border-b border-border">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ease-out ${
                activeTab === 'login' ?'text-primary bg-primary-50 border-b-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="LogIn" size={16} />
                <span>Sign In</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 text-sm font-medium transition-all duration-200 ease-out ${
                activeTab === 'register' ?'text-primary bg-primary-50 border-b-2 border-primary' :'text-text-secondary hover:text-text-primary hover:bg-secondary-50'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Icon name="UserPlus" size={16} />
                <span>Register</span>
              </div>
            </button>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {activeTab === 'login' ? (
              <LoginForm onSuccess={(role) => {
                switch(role) {
                  case 'admin': navigate('/admin-event-management-dashboard');
                    break;
                  case 'usher': navigate('/usher-check-in-interface');
                    break;
                  default:
                    navigate('/event-details-registration');
                }
              }} />
            ) : (
              <RegisterForm onSuccess={() => {
                setActiveTab('login');
              }} />
            )}
          </div>

          {/* Social Login Options */}
          <div className="px-6 pb-6">
            <div className="relative mb-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-surface text-text-secondary">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="flex items-center justify-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200 ease-out">
                <Icon name="Mail" size={16} className="mr-2" />
                Google
              </button>
              <button className="flex items-center justify-center px-4 py-2 border border-border rounded-lg text-sm font-medium text-text-secondary hover:text-text-primary hover:bg-secondary-50 transition-colors duration-200 ease-out">
                <Icon name="Smartphone" size={16} className="mr-2" />
                Microsoft
              </button>
            </div>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-6 text-sm">
            <button className="text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out">
              Privacy Policy
            </button>
            <button className="text-text-secondary hover:text-text-primary transition-colors duration-200 ease-out">
              Terms of Service
            </button>
          </div>
          <p className="mt-4 text-xs text-text-muted">
            © {new Date().getFullYear()} EventFlow. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;