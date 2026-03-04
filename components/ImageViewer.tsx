import React from 'react';
import ImageViewingLib from 'react-native-image-viewing';

interface Props {
  images: { uri: string }[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export default function ImageViewer({
  images,
  visible,
  initialIndex = 0,
  onClose,
}: Props) {
  return (
    <ImageViewingLib
      images={images}
      imageIndex={initialIndex}
      visible={visible}
      onRequestClose={onClose}
      swipeToCloseEnabled
      doubleTapToZoomEnabled
    />
  );
}
