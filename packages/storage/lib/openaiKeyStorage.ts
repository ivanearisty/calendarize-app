import { createStorage } from './base';
import { StorageEnum } from './enums';

// Define the storage key and default value for the OpenAI key
const openaiKeyStorage = createStorage<string>('openai-key', '', {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

export default openaiKeyStorage;
