const baseBabelConfig = {
    loader: 'babel-loader',
    options: {
        presets: [['@babel/preset-typescript']],
        plugins: [['@babel/plugin-proposal-class-properties']],
        passPerPreset: true,
        babelrc: false,
    },
};

const appBabelConfig = JSON.parse(JSON.stringify(baseBabelConfig));

appBabelConfig.options.presets = [
    ...appBabelConfig.options.presets,
    [
        '@babel/preset-env',
        {
            corejs: { version: 3 },
            useBuiltIns: 'usage',
        },
    ],
    [
        '@babel/preset-react',
        {
            runtime: 'automatic',
        },
    ],
];

appBabelConfig.options.plugins = [
    ...appBabelConfig.options.plugins,
    ['lodash'],
    ['@babel/plugin-proposal-decorators', { decoratorsBeforeExport: true }],
    ['@babel/transform-runtime'],
];

module.exports = {
    appBabelConfig: appBabelConfig,
};
