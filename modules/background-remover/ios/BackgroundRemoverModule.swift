// import ExpoModulesCore
// import Vision
// import CoreImage
// import UIKit

// public class BackgroundRemoverModule: Module {
//   public func definition() -> ModuleDefinition {
//     Name("BackgroundRemover")

//     AsyncFunction("removeBackground") { (base64: String, promise: Promise) in
//       guard #available(iOS 17.0, *) else {
//         promise.reject("UNSUPPORTED", "iOS 17+ required")
//         return
//       }

//       guard
//         let imageData = Data(base64Encoded: base64),
//         let uiImage = UIImage(data: imageData)
//       else {
//         promise.reject("INVALID_IMAGE", "Could not decode base64 image")
//         return
//       }

//       Task.detached(priority: .userInitiated) {
//         do {
//           let result = try await self.processImage(uiImage)
//           promise.resolve(result)
//         } catch let err as NSError {
//           promise.reject(err.domain, err.localizedDescription)
//         }
//       }
//     }
//   }

//   // MARK: - Core Logic

//   @available(iOS 17.0, *)
//   private func processImage(_ image: UIImage) async throws -> String {
//     let downsampled = downsample(image, maxDimension: 1500)

//     guard let cgImage = downsampled.cgImage else {
//       throw NSError(domain: "BackgroundRemover", code: 1,
//         userInfo: [NSLocalizedDescriptionKey: "Failed to get CGImage"])
//     }

//     let request = VNGenerateForegroundInstanceMaskRequest()
//     let handler = VNImageRequestHandler(cgImage: cgImage, options: [:])
//     try handler.perform([request])

//     guard let result = request.results?.first else {
//       throw NSError(domain: "BackgroundRemover", code: 2,
//         userInfo: [NSLocalizedDescriptionKey: "No foreground subject detected"])
//     }

//     let maskPixelBuffer = try result.generateScaledMaskForImage(
//       forInstances: result.allInstances,
//       from: handler
//     )

//     guard
//       let masked = applyMask(maskPixelBuffer, to: downsampled),
//       let pngData = masked.pngData()
//     else {
//       throw NSError(domain: "BackgroundRemover", code: 3,
//         userInfo: [NSLocalizedDescriptionKey: "Failed to apply mask or encode PNG"])
//     }

//     return pngData.base64EncodedString()
//   }

//   // MARK: - Mask Application

// private func applyMask(_ mask: CVPixelBuffer, to image: UIImage) -> UIImage? {
//     guard let cgImage = image.cgImage else { return nil }

//     let ciImage    = CIImage(cgImage: cgImage)
//     let maskCI     = CIImage(cvPixelBuffer: mask)
//     let scaleX     = ciImage.extent.width  / maskCI.extent.width
//     let scaleY     = ciImage.extent.height / maskCI.extent.height
//     let scaledMask = maskCI.transformed(by: CGAffineTransform(scaleX: scaleX, y: scaleY))

//     guard let filter = CIFilter(name: "CIBlendWithMask") else { return nil }
//     filter.setValue(ciImage,        forKey: "inputImage")
//     filter.setValue(scaledMask,     forKey: "inputMaskImage")
//     filter.setValue(CIImage.empty(), forKey: "inputBackgroundImage")

//     guard let output = filter.outputImage else { return nil }

//     let context = CIContext(options: [.useSoftwareRenderer: false])
//     guard let cg = context.createCGImage(output, from: output.extent) else { return nil }

//     return UIImage(cgImage: cg)
// }

//   // MARK: - Downsampling

//   private func downsample(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
//     let size  = image.size
//     let scale = min(maxDimension / size.width, maxDimension / size.height, 1.0)
//     guard scale < 1.0 else { return image }
//     let newSize = CGSize(width: size.width * scale, height: size.height * scale)
//     return UIGraphicsImageRenderer(size: newSize).image { _ in
//       image.draw(in: CGRect(origin: .zero, size: newSize))
//     }
//   }
// }
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

    guard let masked = applyMask(maskPixelBuffer, to: downsampled) else {
      throw NSError(domain: "BackgroundRemover", code: 3,
        userInfo: [NSLocalizedDescriptionKey: "Failed to apply mask"])
    }

    let trimmed = trimTransparent(masked, padding: 8)

    guard let pngData = trimmed.pngData() else {
      throw NSError(domain: "BackgroundRemover", code: 4,
        userInfo: [NSLocalizedDescriptionKey: "Failed to encode PNG"])
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
    filter.setValue(ciImage,         forKey: "inputImage")
    filter.setValue(scaledMask,      forKey: "inputMaskImage")
    filter.setValue(CIImage.empty(), forKey: "inputBackgroundImage")

    guard let output = filter.outputImage else { return nil }

    let context = CIContext(options: [.useSoftwareRenderer: false])
    guard let cg = context.createCGImage(output, from: output.extent) else { return nil }

    return UIImage(cgImage: cg)
  }

  // MARK: - Trimming

  /// Crops away fully transparent borders, leaving `padding` px around the subject.
  /// Pixels with alpha <= `alphaThreshold` are treated as transparent so faint
  /// edge noise doesn't stretch the bounding box.
  private func trimTransparent(
    _ image: UIImage,
    padding: Int = 8,
    alphaThreshold: UInt8 = 10
  ) -> UIImage {
    guard let cg = image.cgImage else { return image }
    let w = cg.width
    let h = cg.height
    let bytesPerRow = w * 4
    var pixels = [UInt8](repeating: 0, count: h * bytesPerRow)

    let drawn: Bool = pixels.withUnsafeMutableBytes { buffer in
      guard let ctx = CGContext(
        data: buffer.baseAddress,
        width: w,
        height: h,
        bitsPerComponent: 8,
        bytesPerRow: bytesPerRow,
        space: CGColorSpaceCreateDeviceRGB(),
        bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
      ) else { return false }
      ctx.draw(cg, in: CGRect(x: 0, y: 0, width: w, height: h))
      return true
    }
    guard drawn else { return image }

    var minX = w, minY = h, maxX = -1, maxY = -1
    for y in 0..<h {
      let row = y * bytesPerRow
      for x in 0..<w where pixels[row + x * 4 + 3] > alphaThreshold {
        if x < minX { minX = x }
        if x > maxX { maxX = x }
        if y < minY { minY = y }
        if y > maxY { maxY = y }
      }
    }

    // Fully transparent — nothing to trim to.
    guard maxX >= minX, maxY >= minY else { return image }

    let x0 = max(minX - padding, 0)
    let y0 = max(minY - padding, 0)
    let x1 = min(maxX + padding, w - 1)
    let y1 = min(maxY + padding, h - 1)
    let rect = CGRect(x: x0, y: y0, width: x1 - x0 + 1, height: y1 - y0 + 1)

    guard let cropped = cg.cropping(to: rect) else { return image }
    return UIImage(cgImage: cropped, scale: 1, orientation: .up)
  }

  // MARK: - Downsampling

  private func downsample(_ image: UIImage, maxDimension: CGFloat) -> UIImage {
    let size  = image.size
    let scale = min(maxDimension / size.width, maxDimension / size.height, 1.0)
    guard scale < 1.0 else { return image }
    let newSize = CGSize(width: size.width * scale, height: size.height * scale)

    // Render at 1x so newSize is in pixels. The default format uses the
    // screen scale (3x on most iPhones), which would produce a ~4500px image.
    let format = UIGraphicsImageRendererFormat.default()
    format.scale = 1
    return UIGraphicsImageRenderer(size: newSize, format: format).image { _ in
      image.draw(in: CGRect(origin: .zero, size: newSize))
    }
  }
}