import * as React from 'react';

import { ClothingSubtypeClassifierViewProps } from './ClothingSubtypeClassifier.types';

export default function ClothingSubtypeClassifierView(props: ClothingSubtypeClassifierViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
