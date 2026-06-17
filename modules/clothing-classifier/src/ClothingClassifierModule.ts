import { NativeModule, requireNativeModule } from 'expo';

declare class ClothingClassifierModule extends NativeModule<{}> {
  PI: number;
  setValueAsync(value: string): Promise<void>;
}

export default requireNativeModule<ClothingClassifierModule>('ClothingClassifier');
