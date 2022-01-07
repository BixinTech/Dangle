import {
  Panel,
  Group,
  vlayout,
  layoutConfig,
  Gravity,
  navbar,
  stack,
} from "doric";
import { dangleView, DangleWebGLRenderingContext, vsync } from "dangle";

const global = new Function("return this")();
global.window = {
  devicePixelRatio: 1,
  addEventListener: (() => {}) as any,
  navigator: {
    appVersion:
      "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
    userAgent:
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/95.0.4638.69 Safari/537.36",
  },
  requestAnimationFrame: vsync(context).requestAnimationFrame,
  cancelAnimationFrame: vsync(context).cancelAnimationFrame,
};
global.navigator = global.window.navigator;

import * as pc from "playcanvas";

@Entry
class light_baked extends Panel {
  onShow() {
    navbar(context).setTitle("light_baked");
  }
  build(rootView: Group) {
    vlayout([
      stack(
        [
          dangleView({
            onReady: async (gl: DangleWebGLRenderingContext) => {
              const width = gl.drawingBufferWidth;
              const height = gl.drawingBufferHeight;

              const canvas = {
                width: width,
                height: height,
                style: {},
                addEventListener: (() => {}) as any,
                removeEventListener: (() => {}) as any,
                clientHeight: height,
                getContext: (() => {
                  return gl;
                }) as any,
                getBoundingClientRect: (() => {
                  return {
                    width: width,
                    height: height,
                  };
                }) as any,
              } as HTMLCanvasElement;

              global.window.innerWidth = width;
              global.window.innerHeight = height;

              //#region code to impl
              // Create the app and start the update loop
              const app = new pc.Application(canvas, {});

              app.start();

              // Set the canvas to fill the window and automatically change resolution to be the same as the canvas size
              app.setCanvasFillMode(pc.FILLMODE_FILL_WINDOW);
              app.setCanvasResolution(pc.RESOLUTION_AUTO);

              // All render component primitive shape types
              const shapes = ["box", "cone", "cylinder", "sphere", "capsule"];

              for (let i = 0; i < 40; i++) {
                const shape = shapes[Math.floor(Math.random() * shapes.length)];

                // Create an entity with a render component that is set up to be lightmapped with baked direct lighting
                const entity = new pc.Entity();
                entity.addComponent("render", {
                  castShadows: false,
                  castShadowsLightmap: true,
                  lightmapped: true,
                  type: shape,
                });
                app.root.addChild(entity);

                // random orientation
                entity.setLocalPosition(
                  Math.random() * 10 - 5,
                  Math.random() * 5,
                  Math.random() * 10 - 5
                );
              }

              const ground = new pc.Entity();
              ground.addComponent("render", {
                castShadows: false,
                castShadowsLightmap: false,
                lightmapped: true,
                type: "plane",
              });
              app.root.addChild(ground);
              ground.setLocalPosition(0, -1, 0);
              ground.setLocalScale(40, 40, 40);

              // Create an entity with a directional light component that is configured as a baked light
              const light = new pc.Entity();
              light.addComponent("light", {
                affectDynamic: false,
                affectLightmapped: true,
                bake: true,
                castShadows: true,
                normalOffsetBias: 0.05,
                shadowBias: 0.2,
                shadowDistance: 50,
                shadowResolution: 2048,
                shadowType: pc.SHADOW_PCF3,
                color: pc.Color.GREEN,
                type: "directional",
              });
              app.root.addChild(light);
              light.setLocalEulerAngles(45, 30, 0);

              // Create an entity with an omni light component that is configured as a baked light
              const lightPoint = new pc.Entity();
              lightPoint.addComponent("light", {
                affectDynamic: false,
                affectLightmapped: true,
                bake: true,
                castShadows: true,
                normalOffsetBias: 0.05,
                shadowBias: 0.2,
                shadowDistance: 50,
                shadowResolution: 512,
                shadowType: pc.SHADOW_PCF3,
                color: pc.Color.RED,
                range: 100,
                type: "point",
              });
              lightPoint.setLocalPosition(0, 2, 0);
              app.root.addChild(lightPoint);

              // Create an entity with a camera component
              const camera = new pc.Entity();
              camera.addComponent("camera", {
                clearColor: new pc.Color(0.4, 0.45, 0.5),
                farClip: 100,
                nearClip: 0.05,
              });
              app.root.addChild(camera);

              // lightmap baking properties
              app.scene.lightmapMode = pc.BAKE_COLOR;
              app.scene.lightmapMaxResolution = 2048;

              // For baked lights, this property perhaps has the biggest impact on lightmap resolution:
              app.scene.lightmapSizeMultiplier = 32;

              // bake lightmaps
              app.lightmapper.bake(null, pc.BAKE_COLOR);

              // Set an update function on the app's update event
              let time = 4;

              app.on("update", function (dt) {
                time += dt;

                // orbit camera
                camera.setLocalPosition(20 * Math.sin(time * 0.4), 3, 6);
                camera.lookAt(pc.Vec3.ZERO);
                gl.endFrame();
              });

              //#endregion
            },
          }).apply({
            layoutConfig: layoutConfig().just(),
            width: 300,
            height: 300,
          }),
        ],
        {
          layoutConfig: layoutConfig().just(),
          width: 300,
          height: 300,
        }
      ),
    ])
      .apply({
        layoutConfig: layoutConfig().fit().configAlignment(Gravity.Center),
        space: 20,
        gravity: Gravity.Center,
      })
      .in(rootView);
  }
}
