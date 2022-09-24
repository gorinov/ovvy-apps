const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (baseConfig) => {
    baseConfig.plugins.push(
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'src/index.html'),
        })
    );

    baseConfig.devServer = {
        publicPath: '/',
        contentBase: path.join(__dirname, 'build'),
        open: true,
        port: 3000,
        hot: true,
        historyApiFallback: true
    };
    baseConfig.optimization = {
        runtimeChunk: 'single',
    };
    baseConfig.devtool = 'source-map';
    baseConfig.target = 'web';
    baseConfig.output.publicPath = '/';

    return baseConfig;
};
