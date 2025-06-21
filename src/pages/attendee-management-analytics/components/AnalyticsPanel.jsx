import React from 'react';
import Icon from 'components/AppIcon';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const AnalyticsPanel = ({ eventData, attendees, filteredAttendees }) => {
  // Calculate statistics
  const stats = {
    totalRegistrations: attendees.length,
    checkedIn: attendees.filter(a => a.checkInStatus === 'checked-in').length,
    pending: attendees.filter(a => a.checkInStatus === 'pending').length,
    noShow: attendees.filter(a => a.checkInStatus === 'no-show').length,
    paidAttendees: attendees.filter(a => a.paymentStatus === 'paid').length,
    pendingPayments: attendees.filter(a => a.paymentStatus === 'pending').length
  };

  const checkInRate = Math.round((stats.checkedIn / stats.totalRegistrations) * 100);
  const paymentRate = Math.round((stats.paidAttendees / stats.totalRegistrations) * 100);

  // Registration trend data (mock)
  const registrationTrend = [
    { date: '2024-02-01', registrations: 15 },
    { date: '2024-02-08', registrations: 32 },
    { date: '2024-02-15', registrations: 48 },
    { date: '2024-02-22', registrations: 67 },
    { date: '2024-03-01', registrations: 89 },
    { date: '2024-03-08', registrations: 112 },
    { date: '2024-03-15', registrations: 135 }
  ];

  // Check-in status distribution
  const checkInData = [
    { name: 'Checked In', value: stats.checkedIn, color: '#10B981' },
    { name: 'Pending', value: stats.pending, color: '#F59E0B' },
    { name: 'No Show', value: stats.noShow, color: '#EF4444' }
  ];

  // Ticket type distribution
  const ticketTypeData = attendees.reduce((acc, attendee) => {
    acc[attendee.ticketType] = (acc[attendee.ticketType] || 0) + 1;
    return acc;
  }, {});

  const ticketTypeChart = Object.entries(ticketTypeData).map(([type, count]) => ({
    name: type,
    value: count
  }));

  // Company distribution (top 5)
  const companyData = attendees.reduce((acc, attendee) => {
    acc[attendee.company] = (acc[attendee.company] || 0) + 1;
    return acc;
  }, {});

  const topCompanies = Object.entries(companyData)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([company, count]) => ({ company, count }));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-4">
        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Total Registrations</p>
              <p className="text-2xl font-bold text-text-primary">{stats.totalRegistrations}</p>
            </div>
            <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center">
              <Icon name="Users" size={24} className="text-primary" />
            </div>
          </div>
          <div className="mt-2 flex items-center text-sm">
            <span className="text-success">+12%</span>
            <span className="text-text-secondary ml-1">from last event</span>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Check-in Rate</p>
              <p className="text-2xl font-bold text-text-primary">{checkInRate}%</p>
            </div>
            <div className="w-12 h-12 bg-success-50 rounded-lg flex items-center justify-center">
              <Icon name="UserCheck" size={24} className="text-success" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className="bg-success h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${checkInRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Payment Rate</p>
              <p className="text-2xl font-bold text-text-primary">{paymentRate}%</p>
            </div>
            <div className="w-12 h-12 bg-accent-50 rounded-lg flex items-center justify-center">
              <Icon name="CreditCard" size={24} className="text-accent" />
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-secondary-200 rounded-full h-2">
              <div 
                className="bg-accent h-2 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${paymentRate}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-surface border border-border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-text-secondary">Capacity Used</p>
              <p className="text-2xl font-bold text-text-primary">
                {Math.round((stats.totalRegistrations / eventData.capacity) * 100)}%
              </p>
            </div>
            <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
              <Icon name="Building" size={24} className="text-text-secondary" />
            </div>
          </div>
          <div className="mt-2 text-sm text-text-secondary">
            {stats.totalRegistrations} / {eventData.capacity} attendees
          </div>
        </div>
      </div>

      {/* Check-in Status Chart */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Check-in Status</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={checkInData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {checkInData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          {checkInData.map((item, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span className="text-sm text-text-secondary">{item.name}: {item.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Registration Trend */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Registration Trend</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={registrationTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis 
                dataKey="date" 
                stroke="#64748B"
                fontSize={12}
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis stroke="#64748B" fontSize={12} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleDateString()}
                formatter={(value) => [value, 'Registrations']}
              />
              <Line 
                type="monotone" 
                dataKey="registrations" 
                stroke="#2563EB" 
                strokeWidth={2}
                dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: '#2563EB', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Ticket Type Distribution */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Ticket Types</h3>
        <div className="space-y-3">
          {ticketTypeChart.map((item, index) => {
            const percentage = Math.round((item.value / stats.totalRegistrations) * 100);
            return (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-text-primary font-medium">{item.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-secondary-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="text-sm text-text-secondary w-12 text-right">
                    {item.value}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Companies */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Top Companies</h3>
        <div className="space-y-3">
          {topCompanies.map((item, index) => (
            <div key={index} className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-secondary-200 rounded flex items-center justify-center">
                  <span className="text-xs font-medium text-text-secondary">
                    {index + 1}
                  </span>
                </div>
                <span className="text-sm text-text-primary font-medium">{item.company}</span>
              </div>
              <span className="text-sm text-text-secondary">{item.count} attendees</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-surface border border-border rounded-lg p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">Quick Actions</h3>
        <div className="space-y-2">
          <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors duration-200 ease-out">
            <Icon name="Download" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-primary">Export Attendee List</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors duration-200 ease-out">
            <Icon name="Mail" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-primary">Send Bulk Email</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors duration-200 ease-out">
            <Icon name="BarChart3" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-primary">Generate Report</span>
          </button>
          <button className="w-full flex items-center space-x-3 p-3 text-left hover:bg-secondary-50 rounded-lg transition-colors duration-200 ease-out">
            <Icon name="Settings" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-primary">Event Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPanel;