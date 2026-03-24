import { requireNativeView } from 'expo';
import * as React from 'react';

import { BackgroundRemoverViewProps } from './BackgroundRemover.types';

const NativeView: React.ComponentType<BackgroundRemoverViewProps> =
  requireNativeView('BackgroundRemover');

export default function BackgroundRemoverView(props: BackgroundRemoverViewProps) {
  return <NativeView {...props} />;
}
