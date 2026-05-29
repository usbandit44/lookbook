Pod::Spec.new do |s|
  s.name           = 'ClothingSubtypeClassifier'
  s.version        = '1.0.0'
  s.summary        = 'A sample project summary'
  s.description    = 'A sample project description'
  s.author         = ''
  s.homepage       = 'https://docs.expo.dev/modules/'
  s.platforms      = {
    :ios => '15.1',
    :tvos => '15.1'
  }
  s.source         = { git: '' }
  s.static_framework = true
  s.dependency 'ExpoModulesCore'
  s.pod_target_xcconfig = {
    'DEFINES_MODULE' => 'YES',
  }
  s.source_files = "**/*.{h,m,mm,swift,hpp,cpp}"
  s.frameworks = 'CoreML', 'Vision'

  # 👇 Change resources to resource_bundles
  s.resource_bundles = {
    'ClothingSubtypeClassifier' => ['ClothingTypeClassifier.mlmodel']
  }
end