// module.exports = {
//   presets: ["@vue/cli-plugin-babel/preset"]
// };
module.exports = {
  presets: [
    // ... 他のプリセットがある場合
    [
      '@babel/preset-env',
      {
        targets: '> 0.25%, not dead',
      },
    ],
    '@vue/cli-plugin-babel/preset',
  ],
  plugins: [
    // ... 他のプラグインがある場合
    // ['@babel/plugin-proposal-class-properties', { loose: true }],
    // ['@babel/plugin-proposal-private-methods', { loose: true }],
    ["@babel/plugin-proposal-optional-chaining", {loose: true}],
    ["@babel/plugin-proposal-nullish-coalescing-operator", {loose: true}],
  ],

  env: {
    development: {
      sourceType: 'unambiguous',
      ignore: [
        // /node_modules\/core-js/,
        // /node_modules\/webpack/,
        // /node_modules\/regenerator-runtime/,
      ],
    },
  },
};
