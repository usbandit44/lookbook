require 'json'

package = JSON.parse(File.read(File.join(__dir__, '..', 'package.json')))

Pod::Spec.new do |s|
  s.name           = 'BackgroundRemover'
  s.version        = package['version']
  s.summary        = package['description']
  s.author         = package['author']
  s.homepage       = 'https://github.com'
  s.license        = package['license']
  s.platform       = :ios, '17.0'
  s.source         = { :git => '' }
  s.static_framework = true

  s.dependency 'ExpoModulesCore'

  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
end
