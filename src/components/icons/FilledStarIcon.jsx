function FilledStarIcon() {
  return (
    <img
      style={{ width: '100%', height: '100%', objectFit: 'contain' }}
      src={`${process.env.PUBLIC_URL}/icons/FilledBookmarkIcon.svg`}
      alt="FilledStarIcon"
    />
  );
}

export default FilledStarIcon;
