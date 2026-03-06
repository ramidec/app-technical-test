import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { StyleSheet } from 'react-native-unistyles';
import { Image } from 'expo-image';
import { hapticImpact } from '@/utils/haptics';
import { ImpactFeedbackStyle } from 'expo-haptics';
import ImageViewer from '@/components/ImageViewer';
import type { ImageAttachment as ImageAttachmentType } from '@/types/message';

interface Props {
  attachment: ImageAttachmentType;
  isUser: boolean;
}

const MAX_WIDTH = 220;

export default function ImageAttachment({ attachment, isUser }: Props) {
  const [viewerVisible, setViewerVisible] = useState(false);

  const aspectRatio = attachment.width / attachment.height;
  const displayWidth = Math.min(MAX_WIDTH, attachment.width);
  const displayHeight = displayWidth / aspectRatio;

  return (
    <View style={styles.container}>
      <Pressable
        onPress={() => {
          hapticImpact(ImpactFeedbackStyle.Light);
          setViewerVisible(true);
        }}
      >
        <Image
          source={{ uri: attachment.uri }}
          style={[
            styles.image,
            { width: displayWidth, height: displayHeight },
          ]}
          contentFit="cover"
          transition={300}
        />
      </Pressable>
      {attachment.caption && (
        <Text style={[styles.caption, isUser && styles.captionUser]}>
          {attachment.caption}
        </Text>
      )}
      <ImageViewer
        images={[{ uri: attachment.uri }]}
        visible={viewerVisible}
        initialIndex={0}
        onClose={() => setViewerVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create((theme) => ({
  container: {
    marginTop: 6,
  },
  image: {
    borderRadius: 12,
    backgroundColor: theme.colors.imagePlaceholder,
  },
  caption: {
    fontSize: 13,
    fontFamily: theme.typography.font.regular,
    color: theme.colors.textPrimary,
    marginTop: 4,
  },
  captionUser: {
    color: theme.colors.textWhite,
  },
}));
