import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './BackgroundRemover.types';

type BackgroundRemoverModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class BackgroundRemoverModule extends NativeModule<BackgroundRemoverModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(BackgroundRemoverModule, 'BackgroundRemoverModule');
