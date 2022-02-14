Pod::Spec.new do |s|
    s.name             = 'Dangle'
    s.version          = '0.0.10'
    s.summary          = 'Doric Almost Native Graphics Layer Engine'
  
    s.description      = <<-DESC
    Doric extension library for almost native graphics layer engine
                            DESC

    s.homepage         = 'https://github.com/doric-pub/Dangle'
    s.license          = { :type => 'Apache-2.0', :file => 'LICENSE' }
    s.author           = { 'dev' => 'dev@doric.pub' }
    s.source           = { :git => 'https://github.com/doric-pub/Dangle.git', :tag => s.version.to_s }
    
    s.frameworks = 'OpenGLES','JavaScriptCore'
    s.compiler_flags = '-x objective-c++ -std=c++1z -fno-aligned-allocation'
    s.library = 'c++'
    s.xcconfig = {
           'CLANG_CXX_LANGUAGE_STANDARD' => 'c++11',
           'CLANG_CXX_LIBRARY' => 'libc++'
    }
    s.ios.deployment_target = '10.0'
  
    s.source_files = 'iOS/Classes/**/*','common/**/*','iOS/Dangle/**/*'
    #s.default_subspec = 'Extension'

    # s.subspec 'jsi' do |mm|
    #     mm.source_files = 'common/jsi/jsi.h', 'common/jsi/jsi.cpp', 'common/jsi/instrumentation.h', 'common/jsi/jsi-inl.h', 'common/jsi/jsilib.h'
    #     # mm.source_files = 'common/jsi/*.{h,m,cpp}'
    #     mm.header_mappings_dir = 'common'
    #     mm.public_header_files = 'common/jsi/**/*.h'
    #     mm.xcconfig = { 'ALWAYS_SEARCH_USER_PATHS' => 'NO' }
    # end

    # s.subspec 'Engine' do |mm|
    #     mm.source_files = 'common/dangle/**/*'
    #     mm.dependency 'Dangle/jsi'
    #     mm.header_dir = 'Engine'
    # end

    # s.subspec 'Extension' do |mm|
    #     mm.source_files = 'iOS/Dangle/**/*'
    #     mm.dependency 'Dangle/Engine'
    #     mm.header_dir = 'Extension'
    # end
    
    s.resource     =  "dist/**/*"
    s.public_header_files = 'iOS/Classes/**/*.h','common/**/*.h','iOS/Dangle/**/*.h'
    s.dependency 'DoricCore'
    # s.pod_target_xcconfig = { 'VALID_ARCHS' => 'x86_64 armv7 arm64' }
    # s.pod_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64 x86_64 armv7 i386' }
    # s.user_target_xcconfig = { 'EXCLUDED_ARCHS[sdk=iphonesimulator*]' => 'arm64 x86_64 armv7 i386' }
end
