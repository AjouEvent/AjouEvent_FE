import React from 'react';
import Login from './Login';
import NavigationBar from '../../components/NavigationBar';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white overflow-y-hidden overflow-x-hidden">
      <Login />
      <NavigationBar />
    </div>
  );
}
