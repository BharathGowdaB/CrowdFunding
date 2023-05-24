export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  const days = parseInt(remainingDays.toFixed(0))

  return  days < 0 ? '0' : (days + 1).toString();
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};


