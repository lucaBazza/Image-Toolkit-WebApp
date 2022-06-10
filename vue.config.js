const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  lintOnSave: false,
  // https://vue-view.com/access-vue-js-application-from-external-ip/
  //devServer: {
  //  open: process.platform === 'darwin',
  //  host: '192.168.1.78',
  //  //host: '0.0.0.0',
  //  port: 8080,
  //  https: false
  //},
  pwa: {
    name: "Image Toolkit App",
    themeColor: "#ffd100",
    msTileColor: '#000000',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    // ...Other pwa config options
    // Generate icons  ==>  https://realfavicongenerator.net
    icons: {
      favicon32:      'img/iconsToolKit/favicon-32x32.png',
      favicon16:      'img/iconsToolKit/favicon-16x16.png',
      appleTouchIcon: 'img/iconsToolKit/apple-touch-icon-152x152.png',
      maskIcon:       'img/iconsToolKit/safari-pinned-tab.svg',
      msTileImage:    'img/iconsToolKit/msapplication-icon-144x144.png'
    }, 
  }
});
