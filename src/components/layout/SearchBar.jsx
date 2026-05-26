import React, { useState } from 'react';
import SearchIcon from '../icons/SearchIcon';

const SearchBar = ({
  keyword,
  setKeyword,
  setPage,
  setEvents,
  setSavedKeyword,
  setHasMore,
}) => {
  const [inputTerm, setInputTerm] = useState(keyword);

  const handleSearchClick = async () => {
    await Promise.all([
      setPage && setPage(0),
      setHasMore && setHasMore(true),
      setEvents && setEvents([]),
      setKeyword(inputTerm),
      setSavedKeyword && setSavedKeyword(inputTerm),
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center px-5 pt-3 pb-3 w-full">
      <div className="flex w-full h-12 flex-row justify-between items-center bg-[#F2F4F6] rounded-xl">
        <input
          type="text"
          value={inputTerm}
          onChange={(e) => setInputTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력해 주세요"
          className="flex-1 bg-transparent border-none outline-none text-sm font-medium ml-4 text-[#191F28] placeholder:text-[#B0B8C1] tracking-tight"
        />
        <button
          onClick={handleSearchClick}
          className="mr-4 flex items-center justify-center w-8 h-8 rounded-lg hover:bg-[#E5E8EB] transition-colors"
        >
          <SearchIcon />
        </button>
      </div>
    </div>
  );
};

export default SearchBar;
