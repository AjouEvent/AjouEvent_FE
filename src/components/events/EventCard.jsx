import styled from 'styled-components';
import EmptyStarIcon from '../icons/EmptyStarIcon';
import FilledStarIcon from '../icons/FilledStarIcon';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import { COLORS } from '../constants/appConstants';
import { likeEvent, unlikeEvent } from '../../services/api/event';

const CardContainer = styled.div`
  display: flex;
  align-items: ${(props) => (props.$hasKeyword ? 'flex-start' : 'center')};
  gap: ${(props) => (props.$hasKeyword ? '16px' : '1rem')};
  align-self: stretch;
  width: ${(props) => (props.$hasKeyword ? 'calc(100vw - 40px)' : '100%')};
  height: ${(props) => (props.$hasKeyword ? '144px' : '5rem')};
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  ${(props) => (props.$hasKeyword ? 'margin-top: 24px;' : 'padding: 0.5rem 0;')}
  ${(props) => (props.$hasKeyword ? 'text-decoration: none;' : '')}
`;

const Image = styled.img`
  border-radius: ${(props) => (props.$hasKeyword ? '20px' : '0.5rem')};
  overflow: hidden;
  width: ${(props) => (props.$hasKeyword ? '120px' : '100%')};
  height: ${(props) => (props.$hasKeyword ? '120px' : '100%')};
`;

const DetailsContainer = styled.div`
  display: flex;
  height: ${(props) => (props.$hasKeyword ? 'auto' : '100%')};
  width: ${(props) => (props.$hasKeyword ? 'auto' : 'calc(100% - 5rem)')};
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: ${(props) => (props.$hasKeyword ? '0' : '0.2rem')};
  ${(props) => (props.$hasKeyword ? 'flex-grow: 1;' : '')}
`;

const TitleText = styled.div`
  display: flex;
  width: 100%;
  height: ${(props) => (props.$hasKeyword ? '40px' : 'fit-content')};
  color: ${(props) => (props.$hasKeyword ? COLORS.BLACK : 'black')};
  font-family: 'Pretendard Variable', sans-serif;
  font-size: ${(props) => (props.$hasKeyword ? '16px' : '12px')};
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
  width: ${(props) => (props.$hasKeyword ? '30px' : '1rem')};
  height: ${(props) => (props.$hasKeyword ? 'auto' : '1rem')};
  justify-content: ${(props) => (props.$hasKeyword ? 'space-between' : 'center')};
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
  width: ${(props) => (props.$hasKeyword ? '120px' : '4rem')};
  height: ${(props) => (props.$hasKeyword ? '120px' : '4rem')};
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  height: fit-content;
  flex-direction: column;
  gap: ${(props) => (props.$hasKeyword ? '6px' : '0.2rem')};
`;

const Subject = styled.div`
  width: fit-content;
  padding: 3px 4px;
  height: ${(props) => (props.$hasKeyword ? '20px' : '1rem')};
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: rgba(84, 84, 84, 0.08);
  font-size: ${(props) => (props.$hasKeyword ? '14px' : '10px')};
  color: rgba(84, 84, 84);
  font-weight: ${(props) => (props.$hasKeyword ? 'bold' : '700')};
  font-family: 'Pretendard Variable', sans-serif;
`;

const Stats = styled.div`
  align-self: start;
  display: flex;
  color: #c2c8d1;
  white-space: nowrap;
  text-align: center;
  ${(props) => (props.$hasKeyword ? '' : 'gap: 0.5rem;')}
`;

const StatItem = styled.div`
  display: flex;
  gap: 4px;
  ${(props) => (props.$hasKeyword ? 'padding-right: 20px;' : '')}
`;

const StatIcon = styled.img`
  aspect-ratio: 1;
  object-fit: auto;
  object-position: center;
  width: ${(props) => (props.$hasKeyword ? '14px' : '0.75rem')};
`;

const StatValue = styled.span`
  font-size: 12px;
  font-family: 'Pretendard Variable';
`;

const ImageWapper = styled.div`
  width: 25px;
  height: 25px;
  object-fit: cover;
  cursor: pointer;
`;

const KeywordContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  height: 30px;
`;

const BellIcon = styled.img`
  width: 18px;
  height: 18px;
`;

const KeywordText = styled.div`
  font-size: 16px;
  font-weight: bold;
  color: ${COLORS.DARK_GARY_TEXT};
`;

function Stat({ iconSrc, value, altText, $hasKeyword }) {
  return (
    <StatItem $hasKeyword={$hasKeyword}>
      <StatIcon $hasKeyword={$hasKeyword} src={iconSrc} alt={altText} loading="lazy" />
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
  keyword = null,
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
        await unlikeEvent(id);
        setCardStar(!cardStar);
        setLikes(likes - 1);
      } else {
        await likeEvent(id);
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

  const hasKeyword = keyword != null;
  const formattedContent = content ? content.replace(/\\n/g, ' ') : '';

  return (
    <CardContainer $hasKeyword={hasKeyword} onClick={handleCardClick}>
      <CardImageWapper $hasKeyword={hasKeyword}>
        <Image $hasKeyword={hasKeyword} src={getSafeImageUrl(imgUrl)} alt={title} loading="lazy" />
      </CardImageWapper>
      <DetailsContainer $hasKeyword={hasKeyword}>
        <TitleContainer $hasKeyword={hasKeyword}>
          {hasKeyword ? (
            <div>
              <KeywordContainer>
                <BellIcon
                  src={`${process.env.PUBLIC_URL}/icons/alarm_filled.svg`}
                  alt="Notification Bell"
                />
                <KeywordText>{keyword}</KeywordText>
              </KeywordContainer>
              <TitleText $hasKeyword={hasKeyword}>{title}</TitleText>
              <Subject $hasKeyword={hasKeyword}>{subject}</Subject>
            </div>
          ) : (
            <>
              <TitleText>{title}</TitleText>
              <SubDetailContainer>{formattedContent}</SubDetailContainer>
            </>
          )}
        </TitleContainer>
        <TagContaioner>
          <Stats $hasKeyword={hasKeyword}>
            {!hasKeyword && <Subject>{subject}</Subject>}
            <Stat
              $hasKeyword={hasKeyword}
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/62c7bb15f5fd13739601caff1be349795102bd00b8ccfe603cd2e43498657c46?apiKey=75213697ab8e4fbfb70997e546d69efb&"
              value={viewCount}
              altText="Statistic icon 1"
            />
            <Stat
              $hasKeyword={hasKeyword}
              onClick={handleStarClick}
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/52d95bd6c4badc487be46d013f44cd23b9800d5d1e753fb3a364bcb97b18044f?apiKey=75213697ab8e4fbfb70997e546d69efb&"
              value={likes}
              altText="Statistic icon 2"
            />
          </Stats>
          <LikeContainer $hasKeyword={hasKeyword} onClick={handleStarClick}>
            {hasKeyword ? (
              <ImageWapper>
                {cardStar ? <FilledStarIcon /> : <EmptyStarIcon />}
              </ImageWapper>
            ) : cardStar ? (
              <FilledStarIcon />
            ) : (
              <EmptyStarIcon />
            )}
          </LikeContainer>
        </TagContaioner>
      </DetailsContainer>
    </CardContainer>
  );
};

export default EventCard;
