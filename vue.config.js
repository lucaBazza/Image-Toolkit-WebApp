const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  lintOnSave: false,
  // https://vue-view.com/access-vue-js-application-from-external-ip/
  devServer: {
    //open: process.platform === 'darwin',
    //host: '192.168.1.78',
    ////host: '0.0.0.0',
    //port: 8080,
    //https: false
    //proxy: 'https://exampledomain.com/api/'
    //proxy: 'http://localhost:8080/'
  },
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
  },
  configureWebpack: {
    //devtool: 'source-map'
    devtool: 'eval-source-map'
  }
  /*configureWebpack: (config) => {
    if (process.env.NODE_ENV === 'development') {
      config.devtool = 'eval-source-map';
      config.output.devtoolFallbackModuleFilenameTemplate = 'webpack:///[resource-path]?[hash]';
      config.output.devtoolModuleFilenameTemplate = info => {
        const isVue = info.resourcePath.match(/\.vue$/);
        const isScript = info.query.match(/type=script/);
        const hasModuleId = info.moduleId !== '';

        // Detect generated files, filter as webpack-generated
        if (
          // Must result from vue-loader
          isVue
          // Must not be 'script' files (enough for chrome), or must have moduleId (firefox)
          && (!isScript || hasModuleId)
        ) {
          let pathParts = info.resourcePath.split('/');
          const baseName = pathParts[pathParts.length - 1];
          // prepend 'generated-' to filename as well, so it's easier to find desired files via Ctrl+P
          pathParts.splice(-1,1,`generated-${baseName}`);
          return `webpack-generated:///${pathParts.join('/')}?${info.hash}`;
        }

        // If not generated, filter as webpack-vue
        return `webpack-vue:///${info.resourcePath}`;
      }
    }
  }*/
});
