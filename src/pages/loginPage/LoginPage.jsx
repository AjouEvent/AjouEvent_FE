import React from 'react';
import Login from './Login';
import NavigationBar from '../../components/layout/NavigationBar';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-full h-full">
      <Login />
      <NavigationBar />
    </div>
  );
}
