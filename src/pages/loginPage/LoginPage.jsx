import React from 'react';
import Login from './Login';
import NavigationBar from '../../components/NavigationBar';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white h-screen overflow-y-hidden w-screen overflow-x-hidden">
      <Login />
      <NavigationBar />
    </div>
  );
}
