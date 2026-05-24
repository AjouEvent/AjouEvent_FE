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
      className={`relative flex items-start gap-3.5 w-full cursor-pointer px-5 py-4 border-b border-[#F5F6F8] hover:bg-[#FAFBFC] active:bg-[#F5F6F8] transition-colors ${
        read ? 'bg-white' : 'bg-[#FAFCFF]'
      }`}
    >
      {!read && (
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#3182F6] rounded-r-full" />
      )}
      <div className="relative shrink-0">
        <div className="w-[54px] h-[54px] rounded-2xl overflow-hidden bg-[#F2F4F6]">
          <img
            src={getSafeImageUrl(imageUrl)}
            alt={title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>
        {!read && (
          <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-[#3182F6] border-2 border-white" />
        )}
      </div>
      <div className="flex flex-col flex-1 min-w-0 gap-1.5">
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex w-fit items-center gap-1 px-2 py-0.5 rounded-full bg-[#EEF3FA] text-[#003876] text-[11px] font-bold">
            <img
              src={`${process.env.PUBLIC_URL}/icons/notification.svg`}
              alt="notification"
              className="w-2.5 h-2.5 opacity-60"
            />
            <span>{topicName}</span>
            {keywordName && (
              <span className="text-[#3182F6]">· {keywordName}</span>
            )}
          </div>
        </div>
        <div
          className={`text-[14px] font-semibold leading-snug overflow-hidden ${read ? 'text-[#333D4B]' : 'text-[#191F28]'}`}
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            wordBreak: 'break-word',
          }}
        >
          {title}
        </div>
        <div className="text-[11px] text-[#B0B8C1] font-medium">
          {getTimeAgo(notifiedAt)}
        </div>
      </div>
    </div>
  );
};

export default NotificationCard;
