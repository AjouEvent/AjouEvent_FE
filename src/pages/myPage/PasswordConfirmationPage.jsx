import React from 'react';
import NavigationBar from '../../components/NavigationBar';
import PasswordConfirmation from '../../components/PasswordConfirmation';

export default function PasswordConfirmationPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-screen overflow-x-hidden">
      <PasswordConfirmation />
      <NavigationBar />
    </div>
  );
}
