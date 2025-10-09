import React from 'react';
import { useSelector } from 'react-redux';
import Dashboard from './Dashboard';
import UserDashboard from '../pages/UserDashboard';

const ConditionalDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  if (user?.role === 'user') {
    return <UserDashboard />;
  } else {
    return <Dashboard />;
  }
};

export default ConditionalDashboard;
