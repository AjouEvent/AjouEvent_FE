import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
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

  const getSafeImageUrl = (url) => {
    if (url.startsWith('http://')) {
      return `https://images.weserv.nl/?url=${encodeURIComponent(url)}`;
    }
    return url;
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
      Swal.fire({ icon: 'error', title: '좋아요 에러', text: '로그인이 필요한 기능입니다.' });
    }
  };

  const handleCardClick = () => {
    navigate(`/event/${id}`);
  };

  const formattedContent = content ? content.replace(/\\n/g, ' ') : '';

  return (
    <div
      className="flex cursor-pointer items-center gap-3.5 w-full py-4 border-b border-[#F5F6F8] hover:bg-[#FAFBFC] active:bg-[#F5F6F8] transition-colors px-5"
      onClick={handleCardClick}
    >
      <div className="w-[62px] h-[62px] flex-shrink-0 rounded-xl overflow-hidden bg-[#F2F4F6]">
        <img
          className="w-full h-full object-cover"
          src={getSafeImageUrl(imgUrl)}
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

export default EventCard;
