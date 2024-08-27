const webpack = require('webpack');

module.exports = function override(config, env) {
  // Remove path polyfill
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: false,
    fs: false,
    os: false,
  };
  
  // Remove the ts-loader rule
  config.module.rules = config.module.rules.filter(rule => rule.loader !== 'ts-loader');
  
  return config;
}