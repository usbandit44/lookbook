import * as React from 'react';

import { BackgroundRemoverViewProps } from './BackgroundRemover.types';

export default function BackgroundRemoverView(props: BackgroundRemoverViewProps) {
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
