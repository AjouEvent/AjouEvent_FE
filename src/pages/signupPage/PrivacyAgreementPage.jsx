import React from 'react';
import NavigationBar from '../../components/layout/NavigationBar';
import PrivacyAgreement from './PrivacyAgreement';

export default function PrivacyAgreementPage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-screen overflow-x-hidden">
      <PrivacyAgreement />
      <NavigationBar />
    </div>
  );
}
