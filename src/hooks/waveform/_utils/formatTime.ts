const formatTime = (sec: number): string => {
  const formattedSeconds = Math.floor(sec);
  const minutes = Math.floor(formattedSeconds / 60);
  const seconds = formattedSeconds % 60;

  const formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  return formattedTime;
};

export default formatTime;
