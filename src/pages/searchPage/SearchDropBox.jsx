import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import {
  option1List,
  아주대공지사항,
  학과공지사항,
  단과대공지사항,
  대학원,
  기숙사,
} from '../../constant/searchDropOption';

function FilterOption({
  label,
  options,
  selectedValue,
  setSelectedValue,
  icon,
}) {
  return (
    <FilterOptionWrapper>
      <FilterOptionContent icon={icon}>
        <Select
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e.target.value);
          }}
        >
          <Option value="" disabled>
            {label} 선택
          </Option>
          {options.map((option, index) => (
            <Option key={index} value={option}>
              {option}
            </Option>
          ))}
        </Select>
      </FilterOptionContent>
    </FilterOptionWrapper>
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
        if (아주대공지사항.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2('');
        }
        break;
      case '학과 공지사항':
        setSavedOption1(option1);
        setOption2List(학과공지사항);
        if (학과공지사항.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2('');
        }
        break;
      case '단과대 공지사항':
        setSavedOption1(option1);
        setOption2List(단과대공지사항);
        if (단과대공지사항.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2('');
        }
        break;
      case '기숙사':
        setSavedOption1(option1);
        setOption2List(기숙사);
        if (기숙사.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2('');
        }
        break;
      case '대학원':
        setSavedOption1(option1);
        setOption2List(대학원);
        if (대학원.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2('');
        }
        break;
      default:
        setOption1('아주대학교-일반');
        setOption2List(아주대공지사항);
        setOption2('아주대 공지사항');
        break;
    }
  }, [option1]);

  useEffect(() => {
    const fetchDataAndUpdateState = async () => {
      // option2가 선택되지 않았으면 API 요청을 하지 않음
      if (!option2) return;

      await Promise.all([
        setPage(0),
        setHasMore(true),
        setEvents([]),
        setSavedOption2(option2),
      ]);

      fetchData();

      console.log('type changed to ' + option2);
    };

    fetchDataAndUpdateState();
  }, [option2]);

  return (
    <Container>
      <FilterRow>
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
      </FilterRow>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  padding: 14px;
  margin-bottom: 6px;
  width: 100%;
  font-family: 'Pretendard Variable';
  font-size: 14px;
  color: #1b1e26;
  font-weight: 500;
  text-align: center;
  letter-spacing: -0.98px;
  box-shadow: 0 4px 10px #e5e5e5;
`;

const FilterRow = styled.div`
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: 16px;
`;

const FilterOptionWrapper = styled.div`
  display: flex;
  width: 150px;
  flex-direction: column;
  justify-content: center;
  background-color: #fff;
  border: 1px solid rgba(229, 232, 235, 1);
  border-radius: 50px;
`;

const FilterOptionContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  padding: 8px 16px;
  background-image: url(${(props) => props.icon});
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: right 8px center;
`;

const Select = styled.select`
  -webkit-appearance: none;
  -moz-appearance: none;
  font-family: 'Pretendard Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.98px;
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
  padding-right: 10px;
`;

const Option = styled.option`
  font-family: 'Pretendard Variable';
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.98px;
`;

export default SearchDropBox;
