import React from 'react';

const LocationBar = ({ location }) => {
  return (
    <div className="w-full flex items-center py-[26px] border-b border-black/[0.08]">
      <h1 className="m-0 ml-6 text-black text-[26px] font-bold tracking-[-0.2px]">
        {location}
      </h1>
    </div>
  );
};

export default LocationBar;
