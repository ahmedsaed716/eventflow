import React from 'react';
import Icon from 'components/AppIcon';

const QuickStatsCards = ({ stats }) => {
  const statsCards = [
    {
      title: 'Total Events',
      value: stats.totalEvents,
      icon: 'Calendar',
      color: 'primary',
      trend: '+12%',
      trendUp: true
    },
    {
      title: 'Active Events',
      value: stats.activeEvents,
      icon: 'Play',
      color: 'success',
      trend: '+8%',
      trendUp: true
    },
    {
      title: 'Total Registrations',
      value: stats.totalRegistrations.toLocaleString(),
      icon: 'Users',
      color: 'accent',
      trend: '+24%',
      trendUp: true
    },
    {
      title: 'Avg Attendance Rate',
      value: `${stats.avgAttendanceRate}%`,
      icon: 'TrendingUp',
      color: 'secondary',
      trend: '+5%',
      trendUp: true
    }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'bg-primary-50 text-primary border-primary-100';
      case 'success':
        return 'bg-success-50 text-success border-success-100';
      case 'accent':
        return 'bg-accent-50 text-accent border-accent-100';
      case 'secondary':
        return 'bg-secondary-100 text-secondary-600 border-secondary-200';
      default:
        return 'bg-secondary-100 text-secondary-600 border-secondary-200';
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card, index) => (
        <div
          key={index}
          className="bg-surface border border-border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ease-out"
        >
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-lg border flex items-center justify-center ${getColorClasses(card.color)}`}>
              <Icon name={card.icon} size={20} />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              card.trendUp ? 'text-success' : 'text-error'
            }`}>
              <Icon name={card.trendUp ? 'TrendingUp' : 'TrendingDown'} size={14} />
              <span>{card.trend}</span>
            </div>
          </div>
          
          <div>
            <div className="text-2xl font-bold text-text-primary mb-1">
              {card.value}
            </div>
            <div className="text-sm text-text-secondary">
              {card.title}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuickStatsCards;