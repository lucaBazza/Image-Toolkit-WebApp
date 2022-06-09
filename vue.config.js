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
});
