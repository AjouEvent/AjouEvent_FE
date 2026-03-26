import React, { useState } from 'react';
import styled from 'styled-components';
import SearchIcon from './icons/SearchIcon';
import { COLORS } from '../constants/appConstants';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 14px 20px 10px 20px;
  width: 100%;
`;

const InputContentContainer = styled.div`
  display: flex;
  width: 100%;
  height: 36px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: ${COLORS.WHITE};
  border: 1px solid rgba(229, 232, 235, 1);
  border-radius: 50px;
`;

const InputBox = styled.input`
  display: flex;
  width: 84%;
  flex-direction: column;
  justify-content: center;
  background-color: ${COLORS.WHITE};
  border: none;
  outline: none;
  font-family: 'Pretendard Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.98px;
  margin-left: 16px;
`;

const IconWapper = styled.div`
  margin-right: 16px;
  padding-top: 4px;
  cursor: pointer;
`;

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
      setPage(0),
      setHasMore(true),
      setEvents([]),
      setKeyword(inputTerm),
      setSavedKeyword(inputTerm),
    ]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  };

  return (
    <Container>
      <InputContentContainer>
        <InputBox
          type="text"
          value={inputTerm}
          onChange={(e) => setInputTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="검색어를 입력해 주세요"
        />
        <IconWapper onClick={handleSearchClick}>
          <SearchIcon />
        </IconWapper>
      </InputContentContainer>
    </Container>
  );
};

export default SearchBar;
