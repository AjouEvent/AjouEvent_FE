import React, { useState } from 'react';
import SearchIcon from './icons/SearchIcon';

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
    <div className="flex flex-col items-center justify-center px-5 pt-3.5 pb-2.5 w-full">
      <div className="flex w-full h-9 flex-row justify-between items-center bg-white border border-[rgba(229,232,235,1)] rounded-full">
        <input
          type="text"
          value={inputTerm}
          onChange={(e) => setInputTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력해 주세요"
          className="flex w-[84%] bg-white border-none outline-none text-sm font-medium ml-4 tracking-[-0.98px]"
        />
        <div className="mr-4 pt-1 cursor-pointer" onClick={handleSearchClick}>
          <SearchIcon />
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
