import ExpoModulesCore
import CoreML
import Vision
import UIKit

public class ClothingSubtypeClassifierModule: Module {
  public func definition() -> ModuleDefinition {
    Name("ClothingSubtypeClassifier")

    Constant("PI") {
      Double.pi
    }

    Events("onChange")

    Function("hello") {
      return "Hello world! 👋"
    }

    AsyncFunction("classify") { (fileUri: String, promise: Promise) in
      print("🔍 classify called with: \(fileUri)")

      // 1. Convert file URI → UIImage
      let filePath = fileUri.replacingOccurrences(of: "file://", with: "")
      print("📁 filePath: \(filePath)")

      guard let uiImage = UIImage(contentsOfFile: filePath),
            let ciImage = CIImage(image: uiImage) else {
        print("❌ IMAGE_ERROR: Failed to load image from URI")
        promise.reject("IMAGE_ERROR", "Failed to load image from URI")
        return
      }
      print("✅ Image loaded")

      // 2. Load model from ClothingSubtypeClassifier.bundle
      let resourceBundle = Bundle(path: Bundle.main.path(forResource: "ClothingSubtypeClassifier", ofType: "bundle") ?? "")

      print("📦 Resource bundle: \(String(describing: resourceBundle?.bundlePath))")
      print("📦 Resource bundle mlmodelc: \(resourceBundle?.paths(forResourcesOfType: "mlmodelc", inDirectory: nil) ?? [])")

      let modelURL = resourceBundle?.url(forResource: "ClothingTypeClassifier", withExtension: "mlmodelc")
                  ?? resourceBundle?.url(forResource: "ClothingTypeClassifier", withExtension: "mlmodel")

      print("📦 Model URL: \(String(describing: modelURL))")

      guard let finalModelURL = modelURL,
            let coreMLModel = try? MLModel(contentsOf: finalModelURL),
            let model = try? VNCoreMLModel(for: coreMLModel) else {
        print("❌ MODEL_ERROR: Failed to load model")
        promise.reject("MODEL_ERROR", "Failed to load ClothingTypeClassifier model")
        return
      }
      print("✅ Model loaded from: \(finalModelURL)")

      // 3. Run the classifier
      let request = VNCoreMLRequest(model: model) { request, error in
        if let error = error {
          print("❌ CLASSIFY_ERROR: \(error.localizedDescription)")
          promise.reject("CLASSIFY_ERROR", error.localizedDescription)
          return
        }

        guard let results = request.results as? [VNClassificationObservation],
              let top = results.first else {
          print("❌ RESULT_ERROR: No results")
          promise.reject("RESULT_ERROR", "No classification results")
          return
        }

        print("✅ Classified: \(top.identifier) (\(top.confidence))")

        let allProbs = results.reduce(into: [String: Double]()) { dict, obs in
          dict[obs.identifier] = Double(obs.confidence)
        }

        promise.resolve([
          "label": top.identifier,
          "confidence": Double(top.confidence),
          "allLabels": allProbs
        ])
      }

      // 4. Perform the request
      let handler = VNImageRequestHandler(ciImage: ciImage, options: [:])
      DispatchQueue.global(qos: .userInitiated).async {
        do {
          try handler.perform([request])
        } catch {
          print("❌ HANDLER_ERROR: \(error.localizedDescription)")
          promise.reject("HANDLER_ERROR", error.localizedDescription)
        }
      }
    }

    AsyncFunction("setValueAsync") { (value: String) in
      self.sendEvent("onChange", [
        "value": value
      ])
    }

    View(ClothingSubtypeClassifierView.self) {
      Prop("url") { (view: ClothingSubtypeClassifierView, url: URL) in
        if view.webView.url != url {
          view.webView.load(URLRequest(url: url))
        }
      }
      Events("onLoad")
    }
  }
}