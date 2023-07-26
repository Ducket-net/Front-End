// src/globalUtils.js
export const isIOS17 = () => {
  const iOS17Regex = /OS 17_0.*AppleWebKits/;
  return iOS17Regex.test(navigator.userAgent);
};

export const hexToNumber = (hex) => {
  return parseInt(hex, 16);
};

export default {
  install(app) {
    app.config.globalProperties.$isIOS17 = isIOS17;
    app.config.globalProperties.$hexToNumber = hexToNumber;
  },
};
