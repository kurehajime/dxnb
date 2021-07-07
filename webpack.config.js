const CopyWebpackPlugin = require("copy-webpack-plugin");
let plugins = [];
plugins.push(
  new CopyWebpackPlugin({
    patterns: [
      {
        from: "assets",
        to: ""
      }
    ]
  })
);
module.exports = {
  mode: 'development',
  entry: './src/main.ts',
  output: {
    //  出力ファイルのディレクトリ名
    path: `${__dirname}/docs`,
    // 出力ファイル名
    filename: "main.js"
  },
  plugins: plugins,
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: [
      '.ts', '.js',
    ],
  },
  devServer: {
    open: true,//ブラウザを自動で開く
    port: 80, // ポート番号
  }
};