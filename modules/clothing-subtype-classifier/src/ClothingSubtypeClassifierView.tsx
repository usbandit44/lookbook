import { requireNativeView } from 'expo';
import * as React from 'react';

import { ClothingSubtypeClassifierViewProps } from './ClothingSubtypeClassifier.types';

const NativeView: React.ComponentType<ClothingSubtypeClassifierViewProps> =
  requireNativeView('ClothingSubtypeClassifier');

export default function ClothingSubtypeClassifierView(props: ClothingSubtypeClassifierViewProps) {
  return <NativeView {...props} />;
}
