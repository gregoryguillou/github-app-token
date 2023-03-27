import { createAppAuth } from "@octokit/auth-app";
import { readFileSync } from "fs";
import dotenv from "dotenv";
dotenv.config();

const auth = createAppAuth({
  appId: parseInt(process.env.APP_ID),
  privateKey: readFileSync(process.env.PRIVATE_KEY_FILE, "utf8"),
  clientId: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
});

export const getToken = async () => {
  // Retrieve JSON Web Token (JWT) to authenticate as app
  const appAuthentication = await auth({ type: "app" });
  if (!appAuthentication.token) {
    throw new Error("Could not retrieve JWT token");
  }

  const installationResponse = await fetch(
    "https://api.github.com/app/installations",
    {
      method: "GET",
      headers: { Authorization: `Bearer ${appAuthentication.token}` },
    }
  );

  if (!installationResponse.ok) {
    throw new Error(`HTTP error! status: ${installationResponse.status}`);
  }

  const installations = await installationResponse.json();
  // Get the installation you are interested in (in my case only the first one)
  const installationId = installations[0].id;

  // Get installation access token
  const installationAuthentication = await auth({
    type: "installation",
    installationId,
  });

  if (!installationAuthentication.token) {
    throw new Error("Could not retrieve installation token");
  }
  return installationAuthentication;
};
