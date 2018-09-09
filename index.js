'use strict';

var assign = require('object.assign');

var defaultTargets = {
  android: 30,
  chrome: 35,
  edge: 14,
  explorer: 9,
  firefox: 52,
  safari: 8,
  ucandroid: 1
};

function buildTargets(options) {
  return assign({}, defaultTargets, options.additionalTargets);
}

module.exports = function buildAirbnbPreset(api, options) {
  var transpileTargets = (options && options.targets) || buildTargets(options || {});

  var debug = (options && typeof options.debug === 'boolean') ? !!options.debug : false;

  return {
    presets: [
      [require('@babel/preset-env'), {
        debug: debug,
        exclude: [
          'transform-async-to-generator',
          'transform-template-literals',
          'transform-regenerator'
        ],
        modules: false,
        targets: transpileTargets
      }],
      [require('@babel/preset-react'), { development: api.env('development') }]
    ],
    plugins: [
      options && !!options.removePropTypes ? ['babel-plugin-transform-react-remove-prop-types', assign({
        mode: 'wrap',
        additionalLibraries: ['airbnb-prop-types'],
        ignoreFilenames: ['node_modules']
      }, options.removePropTypes)] : null,

      options && options.modules === false ? null : require('@babel/plugin-transform-modules-commonjs'),
      options && options.modules === false ? null : ['@babel/plugin-transform-strict-mode', { strictMode: true }],
      [require('@babel/plugin-transform-template-literals'), {
        spec: true
      }],
      require('@babel/plugin-transform-property-mutators'),
      require('@babel/plugin-transform-member-expression-literals'),
      require('@babel/plugin-transform-property-literals'),
      require('@babel/plugin-transform-jscript'),
      [require('@babel/plugin-proposal-object-rest-spread'), {
        useBuiltIns: true
      }]
    ].filter(Boolean)
  };
};
