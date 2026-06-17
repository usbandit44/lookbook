import { registerWebModule, NativeModule } from 'expo';

class ClothingClassifierModule extends NativeModule<{}> {
  PI = Math.PI;

  async setValueAsync(value: string): Promise<void> {}
}

export default registerWebModule(ClothingClassifierModule, 'ClothingClassifierModule');
