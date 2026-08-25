export const formatKES = (amount) => `KES ${Number(amount).toLocaleString('en-KE')}`;

export const getCurrentTime = () => {
  return new Date().toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit', hour12: true });
};
