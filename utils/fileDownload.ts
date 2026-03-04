import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';

/**
 * Downloads a remote file to the local cache (if not already cached)
 * and opens it via the native share / "Open with…" sheet.
 */
export async function downloadAndOpenFile(
  uri: string,
  fileName: string,
): Promise<void> {
  // If the URI is already a local file, open it directly
  if (uri.startsWith('file://') || uri.startsWith('/')) {
    const localPath = uri.startsWith('file://') ? uri : `file://${uri}`;
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(localPath);
    }
    return;
  }

  // Download to cache
  const localPath = `${FileSystem.cacheDirectory}${fileName}`;
  const info = await FileSystem.getInfoAsync(localPath);

  if (!info.exists) {
    await FileSystem.downloadAsync(uri, localPath);
  }

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(localPath);
  }
}
