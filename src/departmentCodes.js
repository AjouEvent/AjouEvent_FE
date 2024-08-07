const KtoECodes = {
  AI모빌리티공학과: "AIMobilityEngineering",
  간호대학: "Nursing",
  건설시스템공학과: "CivilSystemsEngineering",
  건축학과: "Architecture",
  경영대학: "Business",
  경영인텔리전스학과: "ManagementIntelligence",
  경영학과: "BusinessAdministration",
  경제학과: "Economics",
  공과대학: "Engineering",
  교통시스템공학과: "TransportationSystemsEngineering",
  국방디지털융합학과: "MilitaryDigitalConvergence",
  국어국문학과: "KoreanLanguageLiterature",
  국제학부대학: "International",
  글로벌경영학과: "GlobalBusiness",
  금융공학과: "FinancialEngineering",
  기계공학과: "MechanicalEngineering",
  기숙사: "Dormitory",
  다산학부대학: "Dasan",
  대학원: "Graduate",
  디지털미디어학과: "DigitalMedia",
  문화콘텐츠학과: "CultureContents",
  물리학과: "Physics",
  불어불문학과: "FrenchLanguageLiterature",
  사이버보안학과: "CyberSecurity",
  사학과: "History",
  사회과학대학: "SocialScience",
  사회학과: "Sociology",
  산업공학과: "IndustrialEngineering",
  생명과학과: "BiologicalScience",
  소프트웨어융합대학: "ComputingInformatics",
  소프트웨어학과: "Software",
  수학과: "Mathmatics",
  스포츠레저학과: "SportsLeisureStudies",
  심리학과: "Psychology",
  "아주대학교-일반": "AjouNormal",
  "아주대학교-장학": "AjouScholarship",
  약학대학: "Pharmacy",
  영어영문학과: "EnglishLanguageLiterature",
  융합시스템공학과: "IntegrativeSystemsEngineering",
  응용화학생명공학과: "AppliedChemistryBiologicalEngineering",
  의과대학: "Medicine",
  인공지능융합학과: "AppliedArtificialIntelligence",
  인문대학: "Humanities",
  자연과학대학: "NaturalScience",
  전자공학과: "ElectricalComputerEngineering",
  정보통신대학: "InformationTechnology",
  정치외교학과: "PoliticalScienceDiplomacy",
  지능형반도체공학과: "IntelligenceSemiconductorEngineering",
  첨단신소재공학과: "MaterialsScienceEngineering",
  행정학과: "PublicAdministration",
  화학공학과: "ChemicalEngineering",
  화학과: "Chemistry",
  환경안전공학과: "EnvironmentalSafetyEngineering",
  테스트: "Test",
};

const EtoKCodes = {
  AIMobilityEngineering: "AI모빌리티공학과",
  Nursing: "간호대학",
  CivilSystemsEngineering: "건설시스템공학과",
  Architecture: "건축학과",
  Business: "경영대학",
  ManagementIntelligence: "경영인텔리전스학과",
  BusinessAdministration: "경영학과",
  Economics: "경제학과",
  Engineering: "공과대학",
  TransportationSystemsEngineering: "교통시스템공학과",
  MilitaryDigitalConvergence: "국방디지털융합학과",
  KoreanLanguageLiterature: "국어국문학과",
  International: "국제학부대학",
  GlobalBusiness: "글로벌경영학과",
  FinancialEngineering: "금융공학과",
  MechanicalEngineering: "기계공학과",
  Dormitory: "기숙사",
  Dasan: "다산학부대학",
  Graduate: "대학원",
  DigitalMedia: "디지털미디어학과",
  CultureContents: "문화콘텐츠학과",
  Physics: "물리학과",
  FrenchLanguageLiterature: "불어불문학과",
  CyberSecurity: "사이버보안학과",
  History: "사학과",
  SocialScience: "사회과학대학",
  Sociology: "사회학과",
  IndustrialEngineering: "산업공학과",
  BiologicalScience: "생명과학과",
  ComputingInformatics: "소프트웨어융합대학",
  Software: "소프트웨어학과",
  Mathmatics: "수학과",
  SportsLeisureStudies: "스포츠레저학과",
  Psychology: "심리학과",
  AjouNormal: "아주대학교-일반",
  AjouScholarship: "아주대학교-장학",
  Pharmacy: "약학대학",
  EnglishLanguageLiterature: "영어영문학과",
  IntegrativeSystemsEngineering: "융합시스템공학과",
  AppliedChemistryBiologicalEngineering: "응용화학생명공학과",
  Medicine: "의과대학",
  AppliedArtificialIntelligence: "인공지능융합학과",
  Humanities: "인문대학",
  NaturalScience: "자연과학대학",
  ElectricalComputerEngineering: "전자공학과",
  InformationTechnology: "정보통신대학",
  PoliticalScienceDiplomacy: "정치외교학과",
  IntelligenceSemiconductorEngineering: "지능형반도체공학과",
  MaterialsScienceEngineering: "첨단신소재공학과",
  PublicAdministration: "행정학과",
  ChemicalEngineering: "화학공학과",
  Chemistry: "화학과",
  EnvironmentalSafetyEngineering: "환경안전공학과",
  Test: "테스트",
};

const priorityOrder = [
  "AIMobilityEngineering",
  "Nursing",
  "CivilSystemsEngineering",
  "Architecture",
  "Business",
  "ManagementIntelligence",
  "BusinessAdministration",
  "Economics",
  "Engineering",
  "TransportationSystemsEngineering",
  "MilitaryDigitalConvergence",
  "KoreanLanguageLiterature",
  "International",
  "GlobalBusiness",
  "FinancialEngineering",
  "MechanicalEngineering",
  "Dormitory",
  "Dasan",
  "Graduate",
  "DigitalMedia",
  "CultureContents",
  "Physics",
  "FrenchLanguageLiterature",
  "CyberSecurity",
  "History",
  "SocialScience",
  "Sociology",
  "IndustrialEngineering",
  "BiologicalScience",
  "ComputingInformatics",
  "Software",
  "Mathmatics",
  "SportsLeisureStudies",
  "Psychology",
  "AjouNormal",
  "AjouScholarship",
  "Pharmacy",
  "EnglishLanguageLiterature",
  "IntegrativeSystemsEngineering",
  "AppliedChemistryBiologicalEngineering",
  "Medicine",
  "AppliedArtificialIntelligence",
  "Humanities",
  "NaturalScience",
  "ElectricalComputerEngineering",
  "InformationTechnology",
  "PoliticalScienceDiplomacy",
  "IntelligenceSemiconductorEngineering",
  "MaterialsScienceEngineering",
  "PublicAdministration",
  "ChemicalEngineering",
  "Chemistry",
  "EnvironmentalSafetyEngineering",
  "Test",
];

export { KtoECodes, EtoKCodes, priorityOrder };
