import React, { useEffect } from 'react';
import { Modal, View, Pressable, StyleSheet } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Props {
  uri: string;
  visible: boolean;
  onClose: () => void;
}

export default function VideoPlayerModal({ uri, visible, onClose }: Props) {
  const insets = useSafeAreaInsets();

  const player = useVideoPlayer(uri, (p) => {
    p.loop = false;
  });

  // Auto-play when modal opens, pause when it closes
  useEffect(() => {
    if (visible) {
      player.play();
    } else {
      player.pause();
    }
  }, [visible, player]);

  const handleClose = () => {
    player.pause();
    onClose();
  };

  return (
    <Modal visible={visible} animationType="fade" statusBarTranslucent transparent>
      <View style={styles.container}>
        <VideoView
          player={player}
          style={styles.video}
          nativeControls
          contentFit="contain"
        />
        <Pressable
          style={[styles.closeButton, { top: insets.top + 12 }]}
          onPress={handleClose}
          hitSlop={12}
        >
          <Ionicons name="close-circle" size={32} color="rgba(255,255,255,0.85)" />
        </Pressable>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    zIndex: 10,
  },
});
