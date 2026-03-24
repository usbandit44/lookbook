import { NativeModule, requireNativeModule } from 'expo';

import { BackgroundRemoverModuleEvents } from './BackgroundRemover.types';

declare class BackgroundRemoverModule extends NativeModule<BackgroundRemoverModuleEvents> {
  PI: number;
  hello(): string;
  setValueAsync(value: string): Promise<void>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<BackgroundRemoverModule>('BackgroundRemover');
