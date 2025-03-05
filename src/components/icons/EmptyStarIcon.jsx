function EmptyStarIcon() {
  return (
    <img
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      src={`${process.env.PUBLIC_URL}/icons/EmptyBookmarkIcon.svg`}
      alt="emptyStarIcon"
    />
  );
}

export default EmptyStarIcon;
