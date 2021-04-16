const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  app.use(
    "/service/api/**",
    createProxyMiddleware({
      target:"http://localhost:8080",
      secure:false,
      changeOrigin: true,
      pathRewrite: function(path) {
        return path.replace("/service/api/", "/");
       }
    })
  );
};