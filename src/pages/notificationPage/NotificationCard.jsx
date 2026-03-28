import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { COLORS } from '../../constant/appConstants';
import { clickNotification } from '../../services/api/notification';

const CardContainer = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 16px;
  align-self: stretch;
  width: 100%;
  text-decoration: none;
  padding: 24px 20px 10px 20px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  cursor: pointer;
  background-color: ${({ read }) =>
    read ? 'transparent' : 'rgba(0, 30, 255, 0.06)'};
`;

const Image = styled.img`
  border-radius: 20px;
  overflow: hidden;
  width: 95px;
  height: 95px;
`;

const DetailsContainer = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
`;

const TitleText = styled.div`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-word;
  width: 100%;
  height: 45px;
  color: ${COLORS.BLACK};
  font-family: 'Pretendard Variable';
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 1.4;
`;

const TimeContainer = styled.div`
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  text-align: right;
  font-size: 12px;
  font-weight: 600;
  color: gray;
  font-family: 'Pretendard Variable';
`;

const CardImageWrapper = styled.div`
  object-fit: cover;
  width: 95px;
  height: 95px;
`;

const TitleContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 6px;
`;

const Subject = styled.div`
  width: fit-content;
  font-family: 'Pretendard Variable';
  padding: 3px 4px;
  height: 20px;
  display: flex;
  gap: 4px;
  justify-content: center;
  align-items: center;
  border-radius: 4px;
  background: rgba(84, 84, 84, 0.08);
  font-size: 14px;
  color: rgba(84, 84, 84);
  font-weight: bold;
`;

const Keyword = styled.span`
  font-family: 'Pretendard Variable';
  font-size: 14px;
  color: ${COLORS.BLUE_MEDIUM};
  font-weight: bold;
`;

const BellIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const NotificationCard = ({
  id,
  title,
  imageUrl,
  clickUrl,
  notifiedAt,
  topicName,
  keywordName,
  read,
}) => {
  const navigate = useNavigate();

  const postNotificationClick = async () => {
    try {
      await clickNotification(id);
    } catch (error) {
      console.error('Error fetching user keywords:', error);
    }
  };

  const getSafeImageUrl = (url) => {
    if (url.startsWith('http://')) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
    }
    return url;
  };

  const handleCardClick = () => {
    const baseUrl = 'https://www.ajouevent.com/';
    const trimmedUrl = clickUrl.startsWith(baseUrl)
      ? clickUrl.replace(baseUrl, '')
      : clickUrl;
    postNotificationClick();
    navigate(`/${trimmedUrl}`);
  };

  const getTimeAgo = (notifiedAt) => {
    const now = new Date();
    const notifiedTime = new Date(notifiedAt);
    const diffInMinutes = Math.floor((now - notifiedTime) / (1000 * 60));

    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}일 전`;
  };

  return (
    <CardContainer onClick={handleCardClick} read={read}>
      <CardImageWrapper>
        <Image src={getSafeImageUrl(imageUrl)} alt={title} loading="lazy" />
      </CardImageWrapper>
      <DetailsContainer>
        <TitleContainer>
          <Subject>
            <BellIcon
              src={`${process.env.PUBLIC_URL}/icons/notification.svg`}
              alt="notification"
            />
            {topicName}
            {keywordName && <Keyword>: {keywordName}</Keyword>}
          </Subject>

          <TitleText>{title}</TitleText>
          <TimeContainer>{getTimeAgo(notifiedAt)}</TimeContainer>
        </TitleContainer>
      </DetailsContainer>
    </CardContainer>
  );
};

export default NotificationCard;
