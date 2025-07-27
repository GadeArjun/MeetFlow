// utils/detectDevice.js
export const getDeviceType = () => {
  const ua = navigator.userAgent;
  if (/Mobi|Android|iPhone|iPad/.test(ua)) return "mobile";
  return "desktop";
};
