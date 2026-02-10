import {
  SecretsManagerClient,
  GetSecretValueCommand
} from "@aws-sdk/client-secrets-manager";

const client = new SecretsManagerClient({
  region: process.env.AWS_REGION || "ap-south-1"
});

export async function loadSecrets(secretName) {
  if (!secretName) {
    throw new Error("Secret name is required");
  }

  const command = new GetSecretValueCommand({
    SecretId: secretName
  });

  const response = await client.send(command);

  if (!response.SecretString) {
    throw new Error("SecretString is empty");
  }

  const secrets = JSON.parse(response.SecretString);

  for (const [key, value] of Object.entries(secrets)) {
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }

  console.log(`✅ Secrets loaded from ${secretName}`);
}