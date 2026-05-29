import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './ClothingSubtypeClassifier.types';

type ClothingSubtypeClassifierModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class ClothingSubtypeClassifierModule extends NativeModule<ClothingSubtypeClassifierModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(ClothingSubtypeClassifierModule, 'ClothingSubtypeClassifierModule');
