export const timestampToDate = (timestamp: number) => {
  const dateObj = new Date(timestamp * 1000);
  return dateObj.toDateString() + ' ' + dateObj.toLocaleTimeString();
};

export const secondsToTime = (seconds: number) => {
  const days = Math.floor(seconds / (24 * 60 * 60));
  seconds -= days * (24 * 60 * 60);
  const hours = Math.floor(seconds / (60 * 60));
  seconds -= hours * (60 * 60);
  const minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;
  return (
    (0 < days ? days.toFixed(0) + ' d ' : '') +
    (0 < hours ? hours.toFixed(0) + ' h ' : '') +
    (0 < minutes ? minutes.toFixed(0) + ' m ' : '') +
    (0 < seconds ? seconds.toFixed(0) + ' s ' : '')
  );
};
