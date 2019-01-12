module.exports = function (api) {
  const presets = [
    "@babel/env",
    "@babel/preset-typescript"
  ];

  api.cache.never();

  return {
    presets
  };
};
