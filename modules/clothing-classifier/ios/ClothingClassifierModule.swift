import ExpoModulesCore
import CoreML
import Vision
import UIKit

public class ClothingClassifierModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ClothingClassifier")

    AsyncFunction("classify") { (fileUri: String, promise: Promise) in
      print("🔍 [ClothingClassifier] classify called with: \(fileUri)")

      // 1. Load image
      let path = fileUri.replacingOccurrences(of: "file://", with: "")
      guard let uiImage = UIImage(contentsOfFile: path),
            let ciImage = CIImage(image: uiImage) else {
        print("❌ [ClothingClassifier] IMAGE_ERROR: Failed to load image")
        promise.reject("IMAGE_ERROR", "Failed to load image from URI")
        return
      }
      print("✅ [ClothingClassifier] Image loaded")

      // 2. Load directly from main bundle
      guard let modelURL = Bundle.main.url(
        forResource: "ClothingColorClassifier",
        withExtension: "mlmodelc"
      ) else {
        print("❌ [ClothingClassifier] MODEL_ERROR: Not found in main bundle")
        promise.reject("MODEL_ERROR", "ClothingColorClassifier.mlmodelc not found")
        return
      }
      print("✅ [ClothingClassifier] Model URL: \(modelURL)")

      guard let mlModel = try? MLModel(contentsOf: modelURL) else {
        print("❌ [ClothingClassifier] MODEL_ERROR: Failed to instantiate MLModel")
        promise.reject("MODEL_ERROR", "Failed to instantiate MLModel")
        return
      }
      print("✅ [ClothingClassifier] MLModel loaded")

      guard let vnModel = try? VNCoreMLModel(for: mlModel) else {
        print("❌ [ClothingClassifier] MODEL_ERROR: Failed to create VNCoreMLModel")
        promise.reject("MODEL_ERROR", "Failed to create VNCoreMLModel")
        return
      }
      print("✅ [ClothingClassifier] VNCoreMLModel created")

      // 3. Run classification
      let request = VNCoreMLRequest(model: vnModel) { req, err in
        if let err = err {
          print("❌ [ClothingClassifier] CLASSIFY_ERROR: \(err.localizedDescription)")
          promise.reject("CLASSIFY_ERROR", err.localizedDescription)
          return
        }

        guard let results = req.results as? [VNClassificationObservation],
              let top = results.first else {
          print("❌ [ClothingClassifier] RESULT_ERROR: No results")
          promise.reject("RESULT_ERROR", "No results")
          return
        }

        print("✅ [ClothingClassifier] Top result: \(top.identifier) — \(top.confidence)")

        let allLabels = results.reduce(into: [String: Double]()) {
          $0[$1.identifier] = Double($1.confidence)
        }

        promise.resolve([
          "label": top.identifier,
          "confidence": Double(top.confidence),
          "allLabels": allLabels
        ])
      }

      // 4. Run on background thread
      let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
      DispatchQueue.global(qos: .userInitiated).async {
        do {
          try handler.perform([request])
        } catch {
          print("❌ [ClothingClassifier] HANDLER_ERROR: \(error.localizedDescription)")
          promise.reject("HANDLER_ERROR", error.localizedDescription)
        }
      }
    }
  }
}