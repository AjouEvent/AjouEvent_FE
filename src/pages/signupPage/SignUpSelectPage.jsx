import React from 'react';
import SignUpSelect from '../../components/SingUpSelect';
import NavigationBar from '../../components/NavigationBar';

export default function SignUpSelectPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-screen overflow-x-hidden">
      <SignUpSelect />
      <NavigationBar />
    </div>
  );
}
