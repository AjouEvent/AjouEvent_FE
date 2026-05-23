import React, { useState, useEffect } from 'react';
import {
  option1List,
  아주대공지사항,
  학과공지사항,
  단과대공지사항,
  대학원,
  기숙사,
} from '../../constants/searchDropOption';

function FilterOption({ label, options, selectedValue, setSelectedValue, icon }) {
  return (
    <div className="flex w-[150px] flex-col justify-center bg-white border border-[rgba(229,232,235,1)] rounded-full">
      <div
        className="flex flex-col gap-[9px] px-4 py-2"
        style={{
          backgroundImage: `url(${icon})`,
          backgroundSize: '24px 24px',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
        }}
      >
        <select
          value={selectedValue}
          onChange={(e) => setSelectedValue(e.target.value)}
          className="appearance-none outline-none border-none bg-transparent text-sm font-medium tracking-[-0.98px] pr-2.5"
          style={{ fontFamily: 'Pretendard Variable' }}
        >
          <option value="" disabled>
            {label} 선택
          </option>
          {options.map((option, index) => (
            <option key={index} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function SearchDropBox({
  setPage,
  setEvents,
  setHasMore,
  fetchData,
  option1,
  setOption1,
  option2,
  setOption2,
  savedOption1,
  setSavedOption1,
  savedOption2,
  setSavedOption2,
}) {
  const [option2List, setOption2List] = useState([]);

  useEffect(() => {
    switch (option1) {
      case '아주대 공지사항':
        setSavedOption1(option1);
        setOption2List(아주대공지사항);
        setOption2(아주대공지사항.includes(savedOption2) ? savedOption2 : '');
        break;
      case '학과 공지사항':
        setSavedOption1(option1);
        setOption2List(학과공지사항);
        setOption2(학과공지사항.includes(savedOption2) ? savedOption2 : '');
        break;
      case '단과대 공지사항':
        setSavedOption1(option1);
        setOption2List(단과대공지사항);
        setOption2(단과대공지사항.includes(savedOption2) ? savedOption2 : '');
        break;
      case '기숙사':
        setSavedOption1(option1);
        setOption2List(기숙사);
        setOption2(기숙사.includes(savedOption2) ? savedOption2 : '');
        break;
      case '대학원':
        setSavedOption1(option1);
        setOption2List(대학원);
        setOption2(대학원.includes(savedOption2) ? savedOption2 : '');
        break;
      default:
        setOption1('아주대학교-일반');
        setOption2List(아주대공지사항);
        setOption2('아주대 공지사항');
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option1]);

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      if (!option2) return;
      await Promise.all([setPage(0), setHasMore(true), setEvents([]), setSavedOption2(option2)]);
      fetchData();
    };
    fetchDataAndUpdateState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option2]);

  return (
    <div className="flex flex-col items-stretch justify-center px-3.5 py-3.5 mb-1.5 w-full text-sm font-medium text-[#1b1e26] tracking-[-0.98px] shadow-[0_4px_10px_#e5e5e5]">
      <div className="flex items-stretch justify-center gap-4">
        <FilterOption
          label="단체"
          options={option1List}
          selectedValue={option1}
          setSelectedValue={setOption1}
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/e9566b1578aea7dfd042515fc7174a5222b2c94f022d10de0bf5f1f4a44f8bf2?apiKey=75213697ab8e4fbfb70997e546d69efb&"
        />
        <FilterOption
          label="상세"
          options={option2List}
          selectedValue={option2}
          setSelectedValue={setOption2}
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/9316045d2a3d77a8384125accfe4d605dfbbba2237b9dcf5c74d5f74feb0de83?apiKey=75213697ab8e4fbfb70997e546d69efb&"
        />
      </div>
    </div>
  );
}

export default SearchDropBox;
