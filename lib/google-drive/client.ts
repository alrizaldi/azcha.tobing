import { GoogleAuth } from "google-auth-library";

// Define types for Google Drive client
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DriveClient = any;

let driveClient: DriveClient | null = null;

export async function getDriveClient(): Promise<DriveClient> {
  if (!driveClient) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { google } = require("googleapis");

    const auth = new GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      },
      scopes: [
        "https://www.googleapis.com/auth/drive.file",
        "https://www.googleapis.com/auth/drive.appdata",
      ],
    });

    const authClient = await auth.getClient();

    driveClient = google.drive({
      version: "v3",
      auth: authClient,
    });
  }

  return driveClient;
}
