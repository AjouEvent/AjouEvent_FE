import React from 'react';

const LocationBar = ({ location }) => {
  return (
    <div className="w-full flex items-center justify-between px-5 pt-6 pb-3 bg-white">
      <div className="flex items-center gap-2.5">
        <div className="w-1 h-[22px] bg-[#3182F6] rounded-full" />
        <h1 className="m-0 text-[#191F28] text-[20px] font-bold tracking-tight leading-none">
          {location}
        </h1>
      </div>
    </div>
  );
};

export default LocationBar;
