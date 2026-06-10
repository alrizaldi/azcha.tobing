import { getDriveClient } from './client';

export async function uploadFileToDrive(
  fileBuffer: Buffer,
  fileName: string,
  mimeType: string,
  parentFolderId?: string
) {
  const drive = getDriveClient();

  const folderId = parentFolderId || process.env.GOOGLE_DRIVE_FOLDER_ID;

  try {
    const response = await drive.files.create({
      requestBody: {
        name: fileName,
        parents: folderId ? [folderId] : undefined,
        mimeType,
      },
      media: {
        mimeType,
        body: fileBuffer,
      },
    });

    const fileId = response.data.id;

    // Make the file publicly readable
    await drive.permissions.create({
      fileId,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    // Get the sharing link
    const result = await drive.files.get({
      fileId,
      fields: 'webViewLink, webContentLink',
    });

    return {
      fileId,
      fileName,
      webViewLink: result.data.webViewLink,
      webContentLink: result.data.webContentLink,
    };
  } catch (error) {
    console.error('Error uploading to Google Drive:', error);
    throw error;
  }
}

export async function deleteFileFromDrive(fileId: string) {
  const drive = getDriveClient();

  try {
    await drive.files.delete({
      fileId,
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting from Google Drive:', error);
    throw error;
  }
}