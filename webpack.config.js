const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
const path = require("path");

// const MonacoEditorSrc = path.join(__dirname, "..", "src");
const relPath = (...args) => path.resolve(__dirname, ...args);
const rootPath = (...args) => relPath(...args);

module.exports = {
  entry: {
    // app: "./index.js",
    //app: "./graphql.js",
    app: "./graphql-example.js",
    'editor.worker': 'monaco-editor/esm/vs/editor/editor.worker.js',
    // 'json.worker': 'monaco-editor/esm/vs/language/json/json.worker.js',
    'graphql.worker': 'monaco-graphql/esm/graphql.worker.js',
  },
  mode: "development",
  devtool: "source-map",
  output: {
    path: rootPath('bundle'),
    filename: '[name].js',
    globalObject: 'self',
  },
  // output: {
  //   path: path.join(__dirname, "./lib/t"),
  //   filename: "index.js",
  // },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: ["file?name=[name].[ext]"],
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env", "@babel/preset-react"],
              plugins: ["@babel/plugin-proposal-class-properties"],
            },
          },
        ],
      },
      {
        test: /\.worker\.js$/,
        use: { 
          loader: 'worker-loader',
          options: { inline: true } 
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.ttf$/,
        use: ["file-loader"],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".json"],
    // Remove alias until https://github.com/microsoft/monaco-editor-webpack-plugin/issues/68 is fixed
    // alias: { "react-monaco-editor": MonacoEditorSrc }
  },
  plugins: [
    new MonacoWebpackPlugin({
      languages: ["json", "javascript", "typescript"],
    }),
  ],
  devServer: { contentBase: "./" },
  node: {
    fs: "empty",
  },
};
