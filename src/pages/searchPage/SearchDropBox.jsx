import React, { useState, useEffect } from 'react';
import {
  option1List,
  아주대공지사항,
  학과공지사항,
  단과대공지사항,
  대학원,
  기숙사,
} from '../../constants/searchDropOption';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

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
    <div className="flex items-center gap-3 px-5 py-3 w-full">
      <Select value={option1} onValueChange={setOption1}>
        <SelectTrigger>
          <SelectValue placeholder="단체 선택" />
        </SelectTrigger>
        <SelectContent>
          {option1List.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={option2} onValueChange={setOption2}>
        <SelectTrigger>
          <SelectValue placeholder="상세 선택" />
        </SelectTrigger>
        <SelectContent>
          {option2List.map((option) => (
            <SelectItem key={option} value={option}>
              {option}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SearchDropBox;
