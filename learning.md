The `storage` system in the boilerplate provides a modular way to work with Chrome’s `chrome.storage` API, including `local`, `sync`, and `session` storage areas. It wraps Chrome’s storage APIs with custom methods and configurations, allowing for a more structured and type-safe approach.

### How It Works

1. **Storage Configuration with `StorageEnum`**:
   - The `StorageEnum` defines storage types: `Local`, `Sync`, `Managed`, and `Session`.
   - Each type has different persistence and access scopes (e.g., `Session` is temporary and cleared when the browser closes, while `Local` persists).

2. **Creating a Storage Instance with `createStorage`**:
   - The `createStorage` function generates a storage instance with a specific key, a fallback default value, and optional configurations.
   - Configurations include the type of storage (`storageEnum`), live updating across extension components (`liveUpdate`), and optional serialization methods for custom data structures.

3. **Main Functionalities of `createStorage`**:
   - **`get`**: Retrieves the value for the key from the chosen storage area. If the value doesn’t exist, it returns a default value (fallback).
   - **`set`**: Saves a new value to storage, accepting either a direct value or an update function.
   - **`subscribe`**: Allows components to react to storage changes.
   - **`getSnapshot`**: Returns the current in-memory value without re-fetching it from storage.
   - **Live Updates**: If `liveUpdate` is enabled, changes in one instance (e.g., popup) are reflected in others (e.g., background scripts) by using the `onChanged` listener.

4. **Handling Session Storage Access for Content Scripts**:
   - The storage setup includes a mechanism for granting content scripts access to session storage (`SessionAccessLevelEnum`).
   - This feature is useful for extensions that need temporary storage accessible across multiple components, including content scripts.

### Example Usage in Your Project

Suppose you want to save a theme preference using this boilerplate storage. Here’s how you’d set up and use a storage instance:

1. **Define a Storage Key and Create the Instance**:
   ```typescript
   import { createStorage } from './base';
   import { StorageEnum } from './enums';

   const themeStorage = createStorage('user-theme', 'light', {
       storageEnum: StorageEnum.Local,
       liveUpdate: true,
   });
   ```

2. **Use the Storage Instance**:
   ```typescript
   // To set a new theme value
   themeStorage.set('dark');

   // To get the current theme value
   themeStorage.get().then((value) => {
       console.log('Current theme:', value);
   });

   // To subscribe to theme changes
   themeStorage.subscribe(() => {
       console.log('Theme changed!');
   });
   ```

3. **Extended Storage with Custom Functions**:
   - You can extend this storage with additional methods, like `toggle`, as shown in `exampleThemeStorage.ts`:
   ```typescript
   export const exampleThemeStorage = {
       ...themeStorage,
       toggle: async () => {
           await themeStorage.set((current) => (current === 'light' ? 'dark' : 'light'));
       },
   };
   ```

### Important Parts Not to Modify

- **`base.ts` and `createStorage` Logic**: These define the foundational storage management and should remain unchanged unless adding new storage types or behaviors.
- **`StorageEnum` and `SessionAccessLevelEnum`**: These enums specify storage types and access levels and should generally be kept as they are.
- **Serialization Methods**: The serialization and deserialization configurations within `createStorage` should be modified only if you need to store complex objects or non-native data types.

This storage system is designed to make Chrome storage more manageable and maintainable across your extension’s components. It abstracts common storage tasks while offering live updates and session access, streamlining development in complex Chrome extensions.

Added opanai storage using the create storage