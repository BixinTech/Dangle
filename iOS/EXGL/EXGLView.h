// Copyright 2016-present 650 Industries. All rights reserved.

#import <EXGL_CPP/UEXGL.h>
#import <EXGL/EXGLContext.h>

#import <EXGL/EXGLObjectManager.h>

NS_ASSUME_NONNULL_BEGIN

@interface EXGLView : UIView <EXGLContextDelegate>

- (instancetype)init;
- (UEXGLContextId)exglCtxId;

@property (nonatomic, assign) NSNumber *msaaSamples;

// "protected"
@property (nonatomic, strong, nullable) EXGLContext *glContext;
@property (nonatomic, strong, nullable) MGLContext *uiEaglCtx;

@property (nonatomic, copy) void (^onSurfaceAvailable)(int width, int height);

@end

NS_ASSUME_NONNULL_END
