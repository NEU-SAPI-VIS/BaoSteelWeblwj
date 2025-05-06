const path = require("path");
// const
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  configureWebpack: {
    devtool: "source-map",
  },
  lintOnSave: false,
  devServer: {
    port: 8001,
    proxy: {
      "/pidasApi": {
        // target: "http://219.216.80.146:7011",
        // target: "http://localhost:5001",
        target: "http://172.20.110.176:5005",
        changeOrigin: true,
      },
    },
  },
  chainWebpack: (config) => {
    config.resolve.alias
      .set("src", resolve("src"))
      .set("src", resolve("@"))
      .set("assets", resolve("src/assets"))
      .set("components", resolve("src/components"))
      .set("router", resolve("src/router"))
      .set("services", resolve("src/services"))
      // .set("layout", resolve("src/layout"))
      .set("store", resolve("src/store"))
      .set("views", resolve("src/views"))
      .set("utils", resolve("src/utils"));
    // config.module.rule("svg").exclude.add(resolve("src/icons")).end();
    // config.module
    //   .rule("icons")
    //   .test(/\.svg$/)
    //   .include.add(resolve("src/icons"))
    //   .end()
    //   .use("svg-sprite-loader")
    //   .loader("svg-sprite-loader")
    //   .options({
    //     symbolId: "icon-[name]",
    //   })
    //   .end();
  },
};
