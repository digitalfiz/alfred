export const tts = require('@google-cloud/speech')({
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
  email: process.env.GOOGLE_CLOUD_EMAIL,
  keyFilename: process.env.GOOGLE_CLOUD_SECRETS_FILE
});
