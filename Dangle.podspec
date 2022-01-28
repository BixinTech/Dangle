Pod::Spec.new do |s|
    s.name             = 'Dangle'
    s.version          = '0.0.3'
    s.summary          = 'Doric Almost Native Graphics Layer Engine'
  
    s.description      = <<-DESC
    Doric extension library for almost native graphics layer engine
                            DESC

    s.homepage         = 'https://github.com/doric-pub/Dangle'
    s.license          = { :type => 'Apache-2.0', :file => 'LICENSE' }
    s.author           = { 'dev' => 'dev@doric.pub' }
    s.source           = { :git => 'https://github.com/doric-pub/Dangle.git', :tag => s.version.to_s }
    s.frameworks = 'OpenGLES'

    s.compiler_flags = '-x objective-c++ -std=c++1z -fno-aligned-allocation'
  
    s.ios.deployment_target = '10.0'
  
    s.source_files = 'iOS/Classes/**/*'
    s.default_subspec = 'Extension'

    s.subspec 'jsi' do |mm|
        mm.source_files = 'common/jsi/jsi.h', 'common/jsi/jsi.cpp', 'common/jsi/jsi.cpp', 'common/jsi/instrumentation.h', 'common/jsi/jsi-inl.h', 'common/jsi/jsilib.h'
        mm.header_dir = 'jsi'
    end

    s.subspec 'Engine' do |mm|
        mm.source_files = 'common/dangle/**/*'
        mm.header_dir = 'Engine'
        mm.dependency 'jsi'
    end

    s.subspec 'Extension' do |mm|
        mm.source_files = 'iOS/Dangle/**/*'
        mm.header_dir = 'Extension'
        mm.dependency 'Engine'
    end
    
    s.resource     =  "dist/**/*"
    s.public_header_files = 'iOS/Classes/**/*.h'
    s.dependency 'DoricCore'
end
