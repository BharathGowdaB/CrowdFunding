export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  return remainingDays.toFixed(0);
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};


export const checkMetamaskConnection = async () => {
  if (typeof window.ethereum !== 'undefined' && window.ethereum.isMetaMask) {
    try {
      // Request connection to MetaMask
      await window.ethereum.enable();
      
      // Connection successful
      console.log('Connected to MetaMask!');
      
      // Do something after the connection is successful
      // For example, you can fetch user account information
      
    } catch (error) {
      // Connection failed
      console.error('Failed to connect to MetaMask:', error);
    }
  } else {
    // MetaMask is not installed or not enabled
    // Handle the error
    console.error('MetaMask is not installed or not enabled.');
  }
}