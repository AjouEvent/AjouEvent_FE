import React, { useState, useEffect } from "react";
import styled from "styled-components";

const option1List = [
  "아주대 공지사항",
  "학과 공지사항",
  "단과대 공지사항",
  "기숙사",
  "대학원"
];

const 아주대공지사항 = ["아주대학교-일반", "아주대학교-장학"];

const 학과공지사항 = [
  "AI모빌리티공학과",
  "간호대학",
  "건설시스템공학과",
  "건축학과",
  "경영인텔리전스학과",
  "경영학과",
  "경제학과",
  "교통시스템공학과",
  "국방디지털융합학과",
  "국어국문학과",
  "국제학부대학",
  "글로벌경영학과",
  "금융공학과",
  "기계공학과",
  "디지털미디어학과",
  "문화콘텐츠학과",
  "물리학과",
  "불어불문학과",
  "사이버보안학과",
  "사학과",
  "사회학과",
  "산업공학과",
  "생명과학과",
  "소프트웨어학과",
  "수학과",
  "스포츠레저학과",
  "심리학과",
  "영어영문학과",
  "융합시스템공학과",
  "응용화학생명공학과",
  "인공지능융합학과",
  "전자공학과",
  "정치외교학과",
  "지능형반도체공학과",
  "첨단신소재공학과",
  "행정학과",
  "화학공학과",
  "화학과",
  "환경안전공학과",
  "테스트"
];

const 단과대공지사항 = [
  "간호대학",
  "경영대학",
  "공과대학",
  "국제학부대학",
  "다산학부대학",
  "사회과학대학",
  "소프트웨어융합대학",
  "약학대학",
  "의과대학",
  "인문대학",
  "자연과학대학",
  "정보통신대학",
];

const 대학원 = ["대학원"];
const 기숙사 = ["기숙사"];

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
      case "아주대 공지사항":
        setSavedOption1(option1);
        setOption2List(아주대공지사항);
        if (아주대공지사항.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2("");
        }
        break;
      case "학과 공지사항":
        setSavedOption1(option1);
        setOption2List(학과공지사항);
        if (학과공지사항.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2("");
        }
        break;
      case "단과대 공지사항":
        setSavedOption1(option1);
        setOption2List(단과대공지사항);
        if (단과대공지사항.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2("");
        }
        break;
      case "기숙사":
        setSavedOption1(option1);
        setOption2List(기숙사);
        if (기숙사.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2("");
        }
        break;
      case "대학원":
        setSavedOption1(option1);
        setOption2List(대학원);
        if (대학원.includes(savedOption2)) {
          setOption2(savedOption2);
        } else {
          setOption2("");
        }
        break;
      default:
        setOption1("아주대 공지사항");
        setOption2List(아주대공지사항);
        setOption2("아주대학교-일반");
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

      console.log("type changed to " + option2);
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
  font-family: "Pretendard Variable";
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
  font-family: "Pretendard Variable";
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
  font-family: "Pretendard Variable";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.98px;
`;

export default SearchDropBox;
