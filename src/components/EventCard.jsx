import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { likeEvent, unlikeEvent } from '../services/api/event';

function Stat({ iconSrc, value, altText }) {
  return (
    <div className="flex items-center gap-1">
      <img
        src={iconSrc}
        alt={altText}
        loading="lazy"
        className="w-3 h-3 object-contain opacity-40"
      />
      <span className="text-[11px] text-[#8B95A1] font-medium">{value}</span>
    </div>
  );
}

const getSafeImageUrl = (url) => {
  if (!url) return '';
  if (url.startsWith('http://')) {
    return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
  }
  return url;
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

const EventCard = ({
  id,
  title,
  subject,
  content,
  imgUrl,
  likesCount,
  viewCount,
  star,
  // notification-specific props
  imageUrl,
  isRead: initialIsRead,
  topicName,
  keywordName,
  notifiedAt,
  clickUrl,
}) => {
  const [cardStar, setCardStar] = useState(star);
  const [likes, setLikes] = useState(likesCount);
  const [isRead, setIsRead] = useState(initialIsRead);
  const navigate = useNavigate();

  const isNotification = notifiedAt !== undefined;
  const effectiveImageUrl = imgUrl || imageUrl;

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
      toast.error('좋아요 에러', { description: '로그인이 필요한 기능입니다.' });
    }
  };

  const handleCardClick = () => {
    if (isNotification) {
      const baseUrl = 'https://www.ajouevent.com/';
      const trimmedUrl = clickUrl.startsWith(baseUrl)
        ? clickUrl.replace(baseUrl, '')
        : clickUrl;
      setIsRead(true);
      navigate(`/${trimmedUrl}`, { state: { notificationId: id } });
    } else {
      navigate(`/event/${id}`);
    }
  };

  const formattedContent = content ? content.replace(/\\n/g, ' ') : '';

  if (isNotification) {
    return (
      <div
        onClick={handleCardClick}
        className={`relative flex items-start gap-3.5 w-full cursor-pointer px-5 py-4 border-b border-[#F5F6F8] hover:bg-[#FAFBFC] active:bg-[#F5F6F8] transition-colors ${
          isRead ? 'bg-white' : 'bg-[#EEF5FF]'
        }`}
      >
        <div className="shrink-0">
          <div className="w-[54px] h-[54px] rounded-2xl overflow-hidden bg-[#F2F4F6]">
            <img
              src={getSafeImageUrl(effectiveImageUrl)}
              alt={title}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          </div>
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
            className={`text-[14px] font-semibold leading-snug overflow-hidden ${isRead ? 'text-[#333D4B]' : 'text-[#191F28]'}`}
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
  }

  return (
    <div
      className="flex cursor-pointer items-center gap-3.5 w-full py-4 border-b border-[#F5F6F8] hover:bg-[#FAFBFC] active:bg-[#F5F6F8] transition-colors px-5"
      onClick={handleCardClick}
    >
      <div className="w-[62px] h-[62px] flex-shrink-0 rounded-xl overflow-hidden bg-[#F2F4F6]">
        <img
          className="w-full h-full object-cover"
          src={getSafeImageUrl(effectiveImageUrl)}
          alt={title}
          loading="lazy"
        />
      </div>

      <div className="flex flex-col flex-1 min-w-0 gap-1">
        <div className="text-[#191F28] font-semibold text-sm leading-[1.4] line-clamp-2 break-keep">
          {title}
        </div>
        <div className="text-[#B0B8C1] text-xs truncate leading-snug">{formattedContent}</div>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="inline-flex px-1.5 py-0.5 rounded-md bg-[#F2F4F6] text-[10px] text-[#6B7684] font-semibold">
            {subject}
          </span>
          <Stat
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/62c7bb15f5fd13739601caff1be349795102bd00b8ccfe603cd2e43498657c46?apiKey=75213697ab8e4fbfb70997e546d69efb&"
            value={viewCount}
            altText="조회수"
          />
          <Stat
            iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/52d95bd6c4badc487be46d013f44cd23b9800d5d1e753fb3a364bcb97b18044f?apiKey=75213697ab8e4fbfb70997e546d69efb&"
            value={likes}
            altText="좋아요"
          />
        </div>
      </div>

      <div
        className="flex-shrink-0 w-8 h-8 flex items-center justify-center cursor-pointer rounded-xl hover:bg-[#F2F4F6] active:bg-[#E5E8EB] transition-colors"
        onClick={handleStarClick}
      >
        <Heart
          className={`w-5 h-5 transition-colors ${cardStar ? 'fill-[#FF4D6D] text-[#FF4D6D]' : 'text-[#C4C9D4]'}`}
        />
      </div>
    </div>
  );
};

export function EventCardSkeleton() {
  return (
    <div className="flex items-center gap-3.5 w-full py-4 border-b border-[#F5F6F8] px-5">
      <div className="w-[62px] h-[62px] flex-shrink-0 rounded-xl bg-[#F2F4F6] animate-pulse" />
      <div className="flex flex-col flex-1 min-w-0 gap-1.5">
        <div className="h-3.5 bg-[#F2F4F6] rounded-lg animate-pulse w-4/5" />
        <div className="h-3.5 bg-[#F2F4F6] rounded-lg animate-pulse w-3/5" />
        <div className="h-3 bg-[#F2F4F6] rounded-md animate-pulse w-2/5 mt-0.5" />
      </div>
      <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-[#F2F4F6] animate-pulse" />
    </div>
  );
}

export default EventCard;
