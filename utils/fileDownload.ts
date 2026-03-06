import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { Alert } from 'react-native';

/**
 * Returns a cache path that is unique per (uri, fileName) pair to avoid
 * collisions when two different URIs share the same filename.
 */
function getCachePath(uri: string, fileName: string): string {
  if (!FileSystem.cacheDirectory) {
    throw new Error('Cache directory unavailable');
  }
  // Simple hash to avoid collisions
  const hash = uri
    .split('')
    .reduce((a, b) => ((a << 5) - a + b.charCodeAt(0)) | 0, 0)
    .toString(36);
  return `${FileSystem.cacheDirectory}${hash}_${fileName}`;
}

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
    if (!(await Sharing.isAvailableAsync())) {
      Alert.alert('Sharing unavailable', 'File sharing is not available on this device.');
      return;
    }
    await Sharing.shareAsync(localPath);
    return;
  }

  // Download to cache using a collision-safe path
  const localPath = getCachePath(uri, fileName);
  const info = await FileSystem.getInfoAsync(localPath);

  if (!info.exists) {
    await FileSystem.downloadAsync(uri, localPath);
  }

  if (!(await Sharing.isAvailableAsync())) {
    Alert.alert('Sharing unavailable', 'File sharing is not available on this device.');
    return;
  }
  await Sharing.shareAsync(localPath);
}
