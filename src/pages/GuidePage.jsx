import React from 'react';
import TabBar from '../components/TabBar';

export default function GuidePage() {
  return (
    <div className="flex flex-col items-center justify-center bg-white w-full overflow-auto">
      <TabBar Title="사용 가이드 ver.0.1.3" />
      <img alt="AndroidInstall" src={`${process.env.PUBLIC_URL}/image/installAndriod.svg`} />
      <img alt="IOSInstall" src={`${process.env.PUBLIC_URL}/image/installIOS.svg`} />
      <hr className="w-full" />
    </div>
  );
}
