import styled from 'styled-components';
import EmptyStarIcon from '../icons/EmptyStarIcon';
import FilledStarIcon from '../icons/FilledStarIcon';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import requestWithAccessToken from '../../services/jwt/requestWithAccessToken';
import Swal from 'sweetalert2';

const CardContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  align-self: stretch;
  width: 100%;
  height: 5rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  padding: 0.5rem 0;
`;

const Image = styled.img`
  border-radius: 0.5rem;
  overflow: hidden;
  width: 100%;
  height: 100%;
`;

const DetailsContainer = styled.div`
  display: flex;
  height: 100%;
  width: calc(100% - 5rem);
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.2rem;
`;

const TitleText = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  color: black;
  font-family: 'Pretendard Variable', sans-serif;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 120%;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  word-break: keep-all;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const SubDetailContainer = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  font-size: 10px;
  font-weight: 600;
  color: gray;
  font-family: 'Pretendard Variable';
`;

const LikeContainer = styled.div`
  display: flex;
  width: 1rem;
  height: 1rem;
  justify-content: center;
  align-items: center;
`;

const TagContaioner = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  justify-content: space-between;
  align-items: end;
`;

const CardImageWapper = styled.div`
  object-fit: cover;
  width: 4rem;
  height: 4rem;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  flex-direction: column;
  gap: 0.2rem;
`;

const Subject = styled.div`
  width: fit-content;
  padding: 3px 4px;
  height: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: rgba(84, 84, 84, 0.08);
  font-size: 10px;
  color: rgba(84, 84, 84);
  font-weight: 700;
  font-family: 'Pretendard Variable', sans-serif;
`;

const Stats = styled.div`
  align-items: start;
  display: flex;
  color: #c2c8d1;
  white-space: nowrap;
  text-align: center;
  gap: 0.5rem;
`;

const StatItem = styled.div`
  display: flex;
  gap: 4px;
`;

const StatIcon = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: 0.75rem;
`;

const StatValue = styled.span`
  font-size: 12px;
  font-family: 'Pretendard Variable';
`;

function Stat({ iconSrc, value, altText }) {
  return (
    <StatItem>
      <StatIcon src={iconSrc} alt={altText} loading="lazy" />
      <StatValue>{value}</StatValue>
    </StatItem>
  );
}

const EventCard = ({
  id,
  title,
  subject,
  content,
  imgUrl,
  likesCount,
  viewCount,
  star,
}) => {
  const [cardStar, setCardStar] = useState(star);
  const [likes, setLikes] = useState(likesCount);
  const navigate = useNavigate();

  // HTTP 이미지 URL을 HTTPS로 변환
  const getSafeImageUrl = (url) => {
    if (url.startsWith('http://')) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
    }
    return url; // HTTPS URL은 그대로 반환
  };

  const handleStarClick = async (e) => {
    e.stopPropagation();

    try {
      if (cardStar) {
        await requestWithAccessToken(
          'delete',
          `${process.env.REACT_APP_BE_URL}/api/event/like/${id}`,
        );
        setCardStar(!cardStar);
        setLikes(likes - 1);
      } else {
        await requestWithAccessToken(
          'post',
          `${process.env.REACT_APP_BE_URL}/api/event/like/${id}`,
        );
        setCardStar(!cardStar);
        setLikes(likes + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      Swal.fire({
        icon: 'error',
        title: '좋아요 에러',
        text: '로그인이 필요한 기능입니다.',
      });
    }
  };

  const handleCardClick = () => {
    navigate(`/event/${id}`);
  };

  const formattedContent = content ? content.replace(/\\n/g, ' ') : '';

  return (
    <CardContainer onClick={handleCardClick}>
      <CardImageWapper>
        <Image src={getSafeImageUrl(imgUrl)} alt={title} loading="lazy" />
      </CardImageWapper>
      <DetailsContainer>
        <TitleContainer>
          <TitleText>{title}</TitleText>
          <SubDetailContainer>{formattedContent}</SubDetailContainer>
        </TitleContainer>
        <TagContaioner>
          <Stats>
            <Subject>{subject}</Subject>
            <Stat
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/62c7bb15f5fd13739601caff1be349795102bd00b8ccfe603cd2e43498657c46?apiKey=75213697ab8e4fbfb70997e546d69efb&"
              value={viewCount}
              altText="Statistic icon 1"
            />
            <Stat
              onClick={handleStarClick}
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/52d95bd6c4badc487be46d013f44cd23b9800d5d1e753fb3a364bcb97b18044f?apiKey=75213697ab8e4fbfb70997e546d69efb&"
              value={likes}
              altText="Statistic icon 2"
            />
          </Stats>
          <LikeContainer onClick={handleStarClick}>
            {cardStar ? (
              <FilledStarIcon></FilledStarIcon>
            ) : (
              <EmptyStarIcon></EmptyStarIcon>
            )}
          </LikeContainer>
        </TagContaioner>
      </DetailsContainer>
    </CardContainer>
  );
};

export default EventCard;
