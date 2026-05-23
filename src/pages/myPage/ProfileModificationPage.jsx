import React from 'react';
import NavigationBar from '../../components/NavigationBar';
import ProfileModification from '../../components/ProfileModification';

export default function ProfileModificationPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-screen overflow-x-hidden">
      <ProfileModification />
      <NavigationBar />
    </div>
  );
}
