const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');

/**
 * Fetches and parses environment configuration from GCP Secret Manager
 * @returns {Promise<Object>} Object containing environment variables
 */
async function fetchSecretConfig() {
  try {
    const projectId = process.env.PROJECT_ID; // Replace with your GCP project ID
    if (!projectId) {
      throw new Error('GCP project ID is not set');
    }
    const client = new SecretManagerServiceClient();
    const name = `projects/${projectId}/secrets/smart_dine_backend/versions/latest`;

    // Access the secret version
    const [version] = await client.accessSecretVersion({ name });

    // Get the secret payload and parse it
    const secretValue = version.payload.data.toString();
    const config = JSON.parse(secretValue);

    // Set environment variables
    Object.entries(config).forEach(([key, value]) => {
      if (key === 'PRIVATE_KEY' || key === 'PUBLIC_KEY') {
        // Decode base64 keys
        process.env[key] = Buffer.from(value, 'base64').toString('utf-8');
      } else {
        process.env[key] = value;
      }
    });

    return config;
  } catch (error) {
    throw new Error(`Failed to fetch secret configuration: ${error.message}`);
  }
}

module.exports = { fetchSecretConfig };
