export default () => ({
  storage: {
    bucketId: process.env.GCLOUD_BUCKET_ID || "northstudio-internal",
    projectId: process.env.GCLOUD_PROJECT_ID || "projectId",
    clientEmail: process.env.GCLOUD_CLIENT_EMAIL || "clientEmail",
    privateKey: process.env.GCLOUD_PRIVATE_KEY && process.env.GCLOUD_PRIVATE_KEY.replace(/(\|\|)/g, '\n'),
  }
});
