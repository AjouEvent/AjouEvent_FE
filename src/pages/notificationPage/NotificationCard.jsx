import { useNavigate } from 'react-router-dom';
import { clickNotification } from '../../services/api/notification';

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
    <div
      onClick={handleCardClick}
      className={`flex items-start gap-4 w-full cursor-pointer px-5 pt-6 pb-2.5 border-b border-black/[0.04] ${
        read ? 'bg-transparent' : 'bg-[rgba(0,30,255,0.06)]'
      }`}
    >
      <div className="w-[95px] h-[95px] shrink-0">
        <img
          src={getSafeImageUrl(imageUrl)}
          alt={title}
          loading="lazy"
          className="w-[95px] h-[95px] rounded-[20px] object-cover"
        />
      </div>
      <div className="flex flex-col w-full gap-1.5">
        <div className="flex w-fit items-center gap-1 px-1 py-[3px] rounded bg-black/[0.08] text-[rgba(84,84,84)] text-sm font-bold">
          <img
            src={`${process.env.PUBLIC_URL}/icons/notification.svg`}
            alt="notification"
            className="w-3.5 h-3.5"
          />
          {topicName}
          {keywordName && (
            <span className="text-[#0066b3] font-bold">: {keywordName}</span>
          )}
        </div>
        <div
          className="text-black text-base font-semibold leading-[1.4] overflow-hidden"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            height: '45px',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </div>
        <div className="w-full text-xs font-semibold text-gray-400 text-right truncate">
          {getTimeAgo(notifiedAt)}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
