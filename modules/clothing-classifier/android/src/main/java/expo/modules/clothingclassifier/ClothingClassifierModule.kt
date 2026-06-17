package expo.modules.clothingclassifier

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class ClothingClassifierModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("ClothingClassifier")

    Constant("PI") {
      Math.PI
    }

    AsyncFunction("setValueAsync") { value: String ->
    }
  }
}
