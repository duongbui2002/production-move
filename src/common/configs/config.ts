export default () => ({
  mongodb: {
    uri: process.env.MONGO_URI
  },
  jwt: {
    accessTokenPrivateKey: process.env.JWT_ACCESS_SECRET,
    refreshTokenPrivateKey: process.env.JWT_REFRESH_SECRET,
    expiresTime: {
      access: process.env.ACCESS_TOKEN_EXPIRES_TIME || "7d",
      refresh: process.env.REFRESH_TOKEN_EXPIRES_TIME || "30m",
      emailVerify: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_TIME || "1d",
      changePassword: process.env.CHANGE_PASSWORD_TOKEN_EXPIRES_TIME || "10m"
    },
  },
})