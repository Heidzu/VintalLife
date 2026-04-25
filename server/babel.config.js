module.exports = {
  presets: [
    [require.resolve('@babel/preset-env')],
    [require.resolve('@babel/preset-react')]
  ],
  plugins: [
    [require.resolve('@babel/plugin-syntax-import-assertions')],
    [require.resolve('@babel/plugin-transform-modules-commonjs')]
  ]
};
