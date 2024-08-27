const webpack = require('webpack');

module.exports = function override(config, env) {
  // Remove path polyfill
  config.resolve.fallback = {
    ...config.resolve.fallback,
    path: false,
    fs: false,
    os: false,
  };
  
  return config;
}