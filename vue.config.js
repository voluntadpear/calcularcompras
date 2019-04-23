module.exports = {
  chainWebpack: config => {
    config.plugin('preload').tap(options => {
      options[0].as = (entry) => {
        if (/\.css$/.test(entry)) return 'style';
        if (/\.woff$/.test(entry)) return 'font';
        if (/\.png$/.test(entry)) return 'image';
        return 'script';
      }
      options[0].include = 'allAssets'
      return options
    })
  },
  pwa: {
    themeColor: "#f5f7fa"
  }
}
