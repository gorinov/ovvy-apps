const path = require('path');
const webpack = require('webpack');
const buildConfig = require('./build.config');

let baseConfig = {
    entry: {
        loader: path.resolve(__dirname, 'src', 'loader.tsx'),
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build'),
        clean: true,
        chunkFilename: '[name].[contenthash:8].js',
        assetModuleFilename: '[name].[contenthash:8][ext]',
    },
    plugins: [
        //new BundleAnalyzerPlugin()
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.scss', '.css'],
        modules: [path.resolve(__dirname, 'src'), 'node_modules'],
        fallback: {
            timers: false,
        },
    },
    optimization: {
        removeEmptyChunks: true,
    },
    module: {
        rules: [
            {
                test: /\.(ts|tsx|js)?$/,
                use: [buildConfig.appBabelConfig],
                exclude: [path.resolve(__dirname, 'node_modules')],
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                include: path.resolve(__dirname, 'node_modules'),
            },
            {
                test: /\.scss$/,
                include: path.resolve(__dirname, 'src'),
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            postcssOptions: {
                                plugins: ['autoprefixer'],
                            },
                        },
                    },
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/resource',
            },
            {
                test: /\.svg$/,
                use: [
                    buildConfig.appBabelConfig,
                    {
                        loader: 'react-svg-loader',
                        options: {
                            jsx: true,
                        },
                    },
                ],
            },
        ],
    },
};

module.exports = (env, argv) => {
    let environment = env.NODE_ENV;

    if (argv.mode === 'production') {
        baseConfig = require('./webpack.config.prod.js')(baseConfig);
    } else {
        baseConfig = require('./webpack.config.dev.js')(baseConfig);
    }

    baseConfig.plugins.push(
        new webpack.DefinePlugin({
            ENVIRONMENT: JSON.stringify(environment),
        })
    );

    return baseConfig;
};
