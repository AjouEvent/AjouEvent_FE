import * as React from "react";
import { useState } from "react";
import styled from "styled-components";

const organiztionOptions = ["단과대", "동아리", "학생회"];
const detailOptions = ["1년 이하", "1-3년", "3년 이상"];

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
          onChange={(e) => setSelectedValue(e.target.value)}
        >
          <Option value="" disabled defaultValue="">
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

function SearchDropBox() {
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedHistory, setSelectedHistory] = useState("");

  return (
    <Container>
      <FilterRow>
        <FilterOption
          label="단체"
          options={organiztionOptions}
          selectedValue={selectedSize}
          setSelectedValue={setSelectedSize}
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/e9566b1578aea7dfd042515fc7174a5222b2c94f022d10de0bf5f1f4a44f8bf2?apiKey=75213697ab8e4fbfb70997e546d69efb&"
        />
        <FilterOption
          label="상세"
          options={detailOptions}
          selectedValue={selectedHistory}
          setSelectedValue={setSelectedHistory}
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
  padding: 20px;
  max-width: 370px;
  gap: 16px;
  font-size: 14px;
  color: #1b1e26;
  font-weight: 500;
  text-align: center;
  letter-spacing: -0.98px;
  box-shadow: 0 0 6px black;
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
  font-family: "Spoqa Han Sans Neo";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.98px;
  appearance: none;
  outline: none;
  border: none;
  background: transparent;
  padding-right: 32px;
`;
const Option = styled.option`
  font-family: "Spoqa Han Sans Neo";
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
  letter-spacing: -0.98px;
`;

export default SearchDropBox;