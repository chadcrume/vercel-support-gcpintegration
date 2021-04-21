const { Storage } = require('@google-cloud/storage');

console.log(`process.env.GCLOUD_CREDENTIALS = ${process.env.GCLOUD_CREDENTIALS}`);

const GCP_cred = process.env.GCLOUD_CREDENTIALS ?
  JSON.parse(
    Buffer.from(process.env.GCLOUD_CREDENTIALS, 'base64').toString()
  ) : null;

console.log(`GCP_cred = ${GCP_cred}`);

module.exports = async (req, res) => {
  var jsonOut = {};
  if (GCP_cred) {
    console.log(`GCP_cred.client_email = ${GCP_cred.client_email}`);
    console.log(`GCP_cred.project_id = ${GCP_cred.project_id}`);
    console.log(`GCP_cred.client_email = ${GCP_cred.client_email}`);
    jsonOut = {
      ...jsonOut,
      GCLOUD_CREDENTIALS: process.env.GCLOUD_CREDENTIALS,
    };

    const storage = new Storage({
      projectId: GCP_cred.project_id,
      credentials: GCP_cred,
      maxRetries: 3,
    });
    console.log(`storage = ${storage}`);

    console.log(`Example from https://cloud.google.com/storage/docs/listing-buckets#code-samples`);
    async function listBuckets() {
      const [buckets] = await storage.getBuckets();

      console.log('Buckets:');
      buckets.forEach(bucket => {
        console.log(bucket.name);
      });
      jsonOut = {
        ...jsonOut,
        buckets: buckets,
      };
    }
    listBuckets().catch(console.error);

    res.json(jsonOut);
  }
}

