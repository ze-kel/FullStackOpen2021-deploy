module.exports = (api) => {
    api.cache(false)

    const presets = [
        [
            '@babel/preset-env',
            {
                modules: false,
            },
        ],
        '@babel/preset-react',
    ]

    const plugins = ['@babel/plugin-transform-runtime']

    return {
        presets,
        plugins,
    }
}
