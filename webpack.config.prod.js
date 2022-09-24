module.exports = (baseConfig) => {
    baseConfig.resolve.alias = {
        react: 'preact/compat',
        'react-dom/test-utils': 'preact/test-utils',
        'react-dom': 'preact/compat',
        'react/jsx-runtime': 'preact/jsx-runtime',
    };
    baseConfig.target = ['web', 'es5'];
    baseConfig.output.publicPath = 'https://ovvy.ru/integration/build/';

    return baseConfig;
};
