export default () => ({
  mongodb: {
    uri: process.env.MONGO_URI
  },
  jwt: {
    accessTokenPrivateKey: process.env.JWT_ACCESS_SECRET,
    refreshTokenPrivateKey: process.env.JWT_REFRESH_SECRET,
    expiresTime: {
      access: process.env.ACCESS_TOKEN_EXPIRES_TIME || "30m",
      refresh: process.env.REFRESH_TOKEN_EXPIRES_TIME || "7d",
      emailVerify: process.env.EMAIL_VERIFY_TOKEN_EXPIRES_TIME || "1d",
      changePassword: process.env.CHANGE_PASSWORD_TOKEN_EXPIRES_TIME || "10m"
    },
    storage: {
      bucketId: process.env.GCLOUD_BUCKET_ID || "northstudio-internal",
      projectId: process.env.GCLOUD_PROJECT_ID || "projectId",
      clientEmail: process.env.GCLOUD_CLIENT_EMAIL || "clientEmail",
      privateKey: process.env.GCLOUD_PRIVATE_KEY && process.env.GCLOUD_PRIVATE_KEY.replace(/(\|\|)/g, '\n'),
    },
  },
  gmail: {
    clientId: process.env.GMAIL_CLIENT_ID,
    clientSecret: process.env.GMAIL_CLIENT_SECRET,
    refreshTokenEmail: process.env.GMAIL_REFRESH_TOKEN,
    adminEmail: process.env.ADMIN_EMAIL
  }
})