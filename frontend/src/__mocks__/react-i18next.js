// __mocks__/react-i18next.js
module.exports = {
  useTranslation: () => ({
    t: (key) => key,
    i18n: { changeLanguage: () => new Promise(() => {}) }
  }),
};
