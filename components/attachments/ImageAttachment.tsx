import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import type { ImageAttachment as ImageAttachmentType } from '@/types/message';

interface Props {
  attachment: ImageAttachmentType;
  isUser: boolean;
}

const MAX_WIDTH = 220;

export default function ImageAttachment({ attachment, isUser }: Props) {
  const aspectRatio = attachment.width / attachment.height;
  const displayWidth = Math.min(MAX_WIDTH, attachment.width);
  const displayHeight = displayWidth / aspectRatio;

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: attachment.uri }}
        style={[
          styles.image,
          { width: displayWidth, height: displayHeight },
        ]}
        contentFit="cover"
        transition={300}
      />
      {attachment.caption && (
        <Text style={[styles.caption, isUser && styles.captionUser]}>
          {attachment.caption}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 6,
  },
  image: {
    borderRadius: 12,
    backgroundColor: '#E5E5EA',
  },
  caption: {
    fontSize: 13,
    color: '#1C1C1E',
    marginTop: 4,
  },
  captionUser: {
    color: '#FFFFFF',
  },
});
