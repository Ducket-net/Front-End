// src/globalUtils.js
export const isIOS17 = () => {
  const iOS17Regex = /OS 17_0.*AppleWebKit/;
  return iOS17Regex.test(navigator.userAgent);
};

export default {
  install(Vue) {
    Vue.prototype.$isIOS17 = isIOS17;
  },
};
