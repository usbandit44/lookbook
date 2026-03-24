import ExpoModulesCore
import Vision
import CoreImage
import UIKit

public class BackgroundRemoverModule: Module {
  public func definition() -> ModuleDefinition {
    Name("BackgroundRemover")

    AsyncFunction("removeBackground") { (base64: String, promise: Promise) in
      guard #available(iOS 17.0, *) else {
        promise.reject("UNSUPPORTED", "iOS 17+ required")
        return
      }

      guard
        let imageData = Data(base64Encoded: base64),
        let uiImage = UIImage(data: imageData)
      else {
        promise.reject("INVALID_IMAGE", "Could not decode base64 image")
        return
      }

      Task.detached(priority: .userInitiated) {
        do {
          let result = try await self.processImage(uiImage)
          promise.resolve(result)
        } catch let err as NSError {
          promise.reject(err.domain, err.localizedDescription)
        }
      }
    }
  }

  // MARK: - Core Logic

  @available(iOS 17.0, *)
  private func processImage(_ image: UIImage) async throws -> String {
    let downsampled = downsample(image, maxDimension: 1500)

    guard let cgImage = downsampled.cgImage else {
      throw NSError(domain: "BackgroundRemover", code: 1,
        userInfo: [NSLocalizedDescriptionKey: "Failed to get CGImage"])
    }

    let request = VNGenerateForegroundInstanceMaskRequest()
    let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
    try handler.perform([request])

    guard let result = request.results?.first else {
      throw NSError(domain: "BackgroundRemover", code: 2,
        userInfo: [NSLocalizedDescriptionKey: "No foreground subject detected"])
    }

    let maskPixelBuffer = try result.generateScaledMaskForImage(
      forInstances: result.allInstances,
      from: handler
    )

    guard
      let masked = applyMask(maskPixelBuffer, to: downsampled),
      let pngData = masked.pngData()
    else {
      throw NSError(domain: "BackgroundRemover", code: 3,
        userInfo: [NSLocalizedDescriptionKey: "Failed to apply mask or encode PNG"])
    }

    return pngData.base64EncodedString()
  }

  // MARK: - Mask Application

private func applyMask(_ mask: CVPixelBuffer, to image: UIImage) -> UIImage? {
    guard let cgImage = image.cgImage else { return nil }

    let ciImage    = CIImage(cgImage: cgImage)
    let maskCI     = CIImage(cvPixelBuffer: mask)
    let scaleX     = ciImage.extent.width  / maskCI.extent.width
    let scaleY     = ciImage.extent.height / maskCI.extent.height
    let scaledMask = maskCI.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))

    guard let filter = CIFilter(name: "CIBlendWithMask") else { return nil }
    filter.setValue(ciImage,        forKey: "inputImage")
    filter.setValue(scaledMask,     forKey: "inputMaskImage")
    filter.setValue(CIImage.empty(), forKey: "inputBackgroundImage")

    guard let output = filter.outputImage else { return nil }

    let context = CIContext(options: [.useSoftwareRenderer: false])
    guard let cg = context.createCGImage(output, from: output.extent) else { return nil }

    return UIImage(cgImage: cg)
}

  // MARK: - Downsampling

  private func downsample(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
    let size  = image.size
    let scale = min(maxDimension / size.width, maxDimension / size.height, 1.0)
    guard scale < 1.0 else { return image }
    let newSize = CGSize(width: size.width * scale, height: size.height * scale)
    return UIGraphicsImageRenderer(size: newSize).image { _ in
      image.draw(in: CGRect(origin: .zero, size: newSize))
    }
  }
}