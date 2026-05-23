import React from 'react';
import NavigationBar from '../../components/NavigationBar';
import DeleteAccount from '../../components/DeleteAccount';

export default function DeleteAccountPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-screen overflow-x-hidden">
      <DeleteAccount />
      <NavigationBar />
    </div>
  );
}
