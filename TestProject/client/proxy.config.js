module.exports = {
  "/api": {
    target: "http://localhost:5000",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
    pathRewrite: {
      "^/api": "/api"
    }
  },

  "/uploads": {
    target: "http://localhost:5000",
    secure: false,
    logLevel: "debug",
    changeOrigin: true,
    pathRewrite: {
      "^/uploads": "/uploads"
    }
  }
};
