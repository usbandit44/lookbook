// Reexport the native module. On web, it will be resolved to ClothingSubtypeClassifierModule.web.ts
// and on native platforms to ClothingSubtypeClassifierModule.ts
export { default } from './src/ClothingSubtypeClassifierModule';
export { default as ClothingSubtypeClassifierView } from './src/ClothingSubtypeClassifierView';
export * from  './src/ClothingSubtypeClassifier.types';
