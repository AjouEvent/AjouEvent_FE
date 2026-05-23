import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import Swal from 'sweetalert2';
import EmptyStarIcon from '../icons/EmptyStarIcon';
import FilledStarIcon from '../icons/FilledStarIcon';
import { likeEvent, unlikeEvent } from '../../services/api/event';

function Stat({ iconSrc, value, altText, hasKeyword }) {
  return (
    <div className={`flex gap-1 ${hasKeyword ? 'pr-5' : ''}`}>
      <img
        src={iconSrc}
        alt={altText}
        loading="lazy"
        className={`aspect-square object-auto object-center ${hasKeyword ? 'w-3.5' : 'w-3'}`}
      />
      <span className="text-xs">{value}</span>
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
  keyword = null,
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

  const hasKeyword = keyword != null;
  const formattedContent = content ? content.replace(/\\n/g, ' ') : '';

  return (
    <div
      className={`flex cursor-pointer border-b border-black/[0.04] ${
        hasKeyword
          ? 'items-start gap-4 w-[calc(100vw-40px)] h-36 mt-6 no-underline'
          : 'items-center gap-4 w-full h-20 py-2'
      }`}
      onClick={handleCardClick}
    >
      <div
        className={`object-cover flex-shrink-0 ${hasKeyword ? 'w-[120px] h-[120px]' : 'w-16 h-16'}`}
      >
        <img
          className={`overflow-hidden object-cover w-full h-full ${hasKeyword ? 'rounded-[20px]' : 'rounded-lg'}`}
          src={getSafeImageUrl(imgUrl)}
          alt={title}
          loading="lazy"
        />
      </div>

      <div
        className={`flex flex-col items-start justify-between ${
          hasKeyword ? 'h-auto flex-grow gap-0' : 'h-full w-[calc(100%-4rem)] gap-[0.2rem]'
        }`}
      >
        <div className={`flex w-full flex-col ${hasKeyword ? 'gap-1.5' : 'gap-[0.2rem]'}`}>
          {hasKeyword ? (
            <div>
              <div className="flex items-center gap-1 h-[30px]">
                <img
                  src={`${process.env.PUBLIC_URL}/icons/alarm_filled.svg`}
                  alt="Notification Bell"
                  className="w-[18px] h-[18px]"
                />
                <div className="text-base font-bold text-[#333]">{keyword}</div>
              </div>
              <div className="flex w-full h-10 text-black font-semibold text-base leading-[120%] line-clamp-2 break-keep overflow-hidden">
                {title}
              </div>
              <div className="w-fit px-1 py-[3px] h-5 flex justify-center items-center rounded bg-black/[0.08] text-sm text-[rgba(84,84,84)] font-bold">
                {subject}
              </div>
            </div>
          ) : (
            <>
              <div className="flex w-full text-black font-semibold text-xs leading-[120%] line-clamp-2 break-keep overflow-hidden">
                {title}
              </div>
              <div className="w-full overflow-hidden whitespace-nowrap text-ellipsis text-[10px] font-semibold text-gray-500">
                {formattedContent}
              </div>
            </>
          )}
        </div>

        <div className="flex w-full justify-between items-end">
          <div className={`flex self-start text-[#c2c8d1] whitespace-nowrap text-center ${!hasKeyword ? 'gap-2' : ''}`}>
            {!hasKeyword && (
              <div className="w-fit px-1 py-[3px] h-4 flex justify-center items-center rounded bg-black/[0.08] text-[10px] text-[rgba(84,84,84)] font-bold">
                {subject}
              </div>
            )}
            <Stat
              hasKeyword={hasKeyword}
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/62c7bb15f5fd13739601caff1be349795102bd00b8ccfe603cd2e43498657c46?apiKey=75213697ab8e4fbfb70997e546d69efb&"
              value={viewCount}
              altText="조회수"
            />
            <Stat
              hasKeyword={hasKeyword}
              iconSrc="https://cdn.builder.io/api/v1/image/assets/TEMP/52d95bd6c4badc487be46d013f44cd23b9800d5d1e753fb3a364bcb97b18044f?apiKey=75213697ab8e4fbfb70997e546d69efb&"
              value={likes}
              altText="좋아요"
            />
          </div>

          <div
            className={`flex justify-center items-center cursor-pointer ${hasKeyword ? 'w-[30px] h-auto' : 'w-4 h-4'}`}
            onClick={handleStarClick}
          >
            {hasKeyword ? (
              <div className="w-[25px] h-[25px] object-cover cursor-pointer">
                {cardStar ? <FilledStarIcon /> : <EmptyStarIcon />}
              </div>
            ) : cardStar ? (
              <FilledStarIcon />
            ) : (
              <EmptyStarIcon />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
