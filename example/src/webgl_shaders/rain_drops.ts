import {
  Panel,
  Group,
  vlayout,
  layoutConfig,
  Gravity,
  navbar,
  gestureContainer,
  GestureContainer,
} from "doric";
import { dangleView, DangleWebGLRenderingContext, vsync } from "dangle";

import * as THREE from "three";

@Entry
class rain_drops extends Panel {
  private gestureView?: GestureContainer;

  onShow() {
    navbar(context).setTitle("rain_drops");
  }
  build(rootView: Group) {
    const self = this;
    vlayout([
      (self.gestureView = gestureContainer(
        [
          dangleView({
            onReady: async (gl: DangleWebGLRenderingContext) => {
              const width = gl.drawingBufferWidth;
              const height = gl.drawingBufferHeight;

              const inputCanvas = {
                width: width,
                height: height,
                style: {},
                addEventListener: ((
                  name: string,
                  fn: (event: { pageX: number; pageY: number }) => void
                ) => {
                  if (name == "touchstart") {
                    self.gestureView!!.onTouchDown = ({ x, y }) => {
                      fn({
                        pageX: x * Environment.screenScale,
                        pageY: y * Environment.screenScale,
                      });
                    };
                  } else if (name == "touchmove") {
                    self.gestureView!!.onTouchUp = ({ x, y }) => {
                      fn({
                        pageX: x * Environment.screenScale,
                        pageY: y * Environment.screenScale,
                      });
                    };
                  } else if (name == "mousemove") {
                    self.gestureView!!.onTouchMove = ({ x, y }) => {
                      fn({
                        pageX: x * Environment.screenScale,
                        pageY: y * Environment.screenScale,
                      });
                    };
                  }
                }) as any,
                removeEventListener: (() => { }) as any,
                setPointerCapture: (() => { }) as any,
                releasePointerCapture: (() => { }) as any,
                clientHeight: height,
                getContext: (() => {
                  return gl;
                }) as any,
              } as HTMLCanvasElement;

              let window = {
                innerWidth: width,
                innerHeight: height,
                devicePixelRatio: 1,
                addEventListener: (() => { }) as any,
              };

              const requestAnimationFrame =
                vsync(context).requestAnimationFrame;

              //#region code to impl

              var renderer, scene, camera, clock, stats, uniforms;

              init();
              animate();

              /*
               * Initializes the sketch
               */
              function init() {
                // Initialize the WebGL renderer
                renderer = new THREE.WebGLRenderer({ canvas: inputCanvas });
                renderer.setPixelRatio(window.devicePixelRatio);
                renderer.setSize(window.innerWidth, window.innerHeight);

                // Initialize the scene
                scene = new THREE.Scene();

                // Initialize the camera
                camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

                // Initialize the clock
                clock = new THREE.Clock(true);

                // Create the plane geometry
                var geometry = new THREE.PlaneGeometry(2, 2);

                // Define the shader uniforms
                uniforms = {
                  u_time: {
                    type: "f",
                    value: 0.0,
                  },
                  u_frame: {
                    type: "f",
                    value: 0.0,
                  },
                  u_resolution: {
                    type: "v2",
                    value: new THREE.Vector2(
                      window.innerWidth,
                      window.innerHeight
                    ).multiplyScalar(window.devicePixelRatio),
                  },
                  u_mouse: {
                    type: "v2",
                    value: new THREE.Vector2(
                      0.7 * window.innerWidth,
                      window.innerHeight
                    ).multiplyScalar(window.devicePixelRatio),
                  },
                };

                // Create the shader material
                var material = new THREE.ShaderMaterial({
                  uniforms: uniforms,
                  vertexShader: `
                    #define GLSLIFY 1
                    /*
                    * The main program
                    */
                    void main() {
                        // Vertex shader output
                        gl_Position = vec4(position, 1.0);
                    }
                  `,
                  fragmentShader: `
                    #define GLSLIFY 1
                    #define PI 3.14159265

                    // Common uniforms
                    uniform vec2 u_resolution;
                    uniform vec2 u_mouse;
                    uniform float u_time;
                    uniform float u_frame;

                    /*
                    * Random number generator with a float seed
                    *
                    * Credits:
                    * http://byteblacksmith.com/improvements-to-the-canonical-one-liner-glsl-rand-for-opengl-es-2-0
                    */
                    highp float random1d(float dt) {
                        highp float c = 43758.5453;
                        highp float sn = mod(dt, 3.14);
                        return fract(sin(sn) * c);
                    }

                    /*
                    *  Returns a random drop position for the given seed value
                    */
                    vec2 random_drop_pos(float val, vec2 screen_dim, vec2 velocity) {
                        float max_x_move = velocity.x * abs(screen_dim.y / velocity.y);
                        float x = -max_x_move * step(0.0, max_x_move) + (screen_dim.x + abs(max_x_move)) * random1d(val);
                        float y = (1.0 + 0.05 * random1d(1.234 * val)) * screen_dim.y;

                        return vec2(x, y);
                    }

                    /*
                    * Calculates the drop trail color at the given pixel position
                    */
                    vec3 trail_color(vec2 pixel, vec2 pos, vec2 velocity_dir, float width, float size) {
                        vec2 pixel_dir = pixel - pos;
                        float projected_dist = dot(pixel_dir, -velocity_dir);
                        float tanjential_dist_sq = dot(pixel_dir, pixel_dir) - pow(projected_dist, 2.0);
                        float width_sq = pow(width, 2.0);

                        float line = step(0.0, projected_dist) * (1.0 - smoothstep(width_sq / 2.0, width_sq, tanjential_dist_sq));
                        float dashed_line = line * step(0.5, cos(0.3 * projected_dist - PI / 3.0));
                        float fading_dashed_line = dashed_line * (1.0 - smoothstep(size / 5.0, size, projected_dist));

                        return vec3(fading_dashed_line);
                    }

                    /*
                    * Calculates the drop wave color at the given pixel position
                    */
                    vec3 wave_color(vec2 pixel, vec2 pos, float size, float time) {
                        vec2 pixel_dir = pixel - pos;
                        float distorted_dist = length(pixel_dir * vec2(1.0, 3.5));

                        float inner_radius = (0.05 + 0.8 * time) * size;
                        float outer_radius = inner_radius + 0.25 * size;

                        float ring = smoothstep(inner_radius, inner_radius + 5.0, distorted_dist)
                                * (1.0 - smoothstep(outer_radius, outer_radius + 5.0, distorted_dist));
                        float fading_ring = ring * (1.0 - smoothstep(0.0, 0.7, time));

                        return vec3(fading_ring);
                    }

                    /*
                    * Calculates the background color at the given pixel position
                    */
                    vec3 background_color(vec2 pixel, vec2 screen_dim, float time) {
                        return vec3(0.0, 0.0, 1.0 - smoothstep(-1.0, 0.8 + 0.2 * cos(0.5 * time), pixel.y / screen_dim.y));
                    }

                    /*
                    * The main program
                    */
                    void main() {
                        // Set the total number of rain drops that are visible at a given time
                        const float n_drops = 20.0;

                        // Set the drop trail radius
                        float trail_width = 2.0;

                        // Set the drop trail size
                        float trail_size = 70.0;

                        // Set the drop wave size
                        float wave_size = 20.0;

                        // Set the drop fall time in seconds
                        float fall_time = 0.7;

                        // Set the drop total life time
                        float life_time = fall_time + 0.5;

                        // Set the drop velocity in pixels per second
                        vec2 velocity = vec2(u_mouse.x - 0.5 * u_resolution.x, -0.9 * u_resolution.y) / fall_time;
                        vec2 velocity_dir = normalize(velocity);

                        // Iterate over the drops to calculate the pixel color
                        vec3 pixel_color = vec3(0.0);

                        for (float i = 0.0; i < n_drops; ++i) {
                            // Offset the running time for each drop
                            float time = u_time + life_time * (i + i / n_drops);

                            // Calculate the time since the drop appeared on the screen
                            float ellapsed_time = mod(time, life_time);

                            // Calculate the drop initial position
                            vec2 initial_pos = random_drop_pos(i + floor(time / life_time - i) * n_drops, u_resolution, velocity);

                            // Add the drop to the pixel color
                            if (ellapsed_time < fall_time) {
                                // Calculate the drop current position
                                vec2 current_pos = initial_pos + ellapsed_time * velocity;

                                // Add the trail color to the pixel color
                                pixel_color += trail_color(gl_FragCoord.xy, current_pos, velocity_dir, trail_width, trail_size);
                            } else {
                                // Calculate the drop final position
                                vec2 final_pos = initial_pos + fall_time * velocity;

                                // Add the wave color to the pixel color
                                pixel_color += wave_color(gl_FragCoord.xy, final_pos, wave_size, ellapsed_time - fall_time);
                            }
                        }

                        // Add the background color to the pixel color
                        pixel_color += background_color(gl_FragCoord.xy, u_resolution, u_time);

                        // Fragment shader output
                        gl_FragColor = vec4(pixel_color, 1.0);
                    }
                  `,
                });

                // Create the mesh and add it to the scene
                var mesh = new THREE.Mesh(geometry, material);
                scene.add(mesh);

                // Add the event listeners
                window.addEventListener("resize", onWindowResize, false);
                renderer.domElement.addEventListener(
                  "mousemove",
                  onMouseMove,
                  false
                );
                renderer.domElement.addEventListener(
                  "touchstart",
                  onTouchMove,
                  false
                );
                renderer.domElement.addEventListener(
                  "touchmove",
                  onTouchMove,
                  false
                );
              }

              /*
               * Animates the sketch
               */
              function animate() {
                requestAnimationFrame(animate);
                render();

                gl.endFrame();
              }

              /*
               * Renders the sketch
               */
              function render() {
                uniforms.u_time.value = clock.getElapsedTime();
                uniforms.u_frame.value += 1.0;
                renderer.render(scene, camera);
              }

              /*
               * Updates the renderer size and the uniforms when the window is resized
               */
              function onWindowResize(event) {
                // Update the renderer
                renderer.setSize(window.innerWidth, window.innerHeight);

                // Update the resolution uniform
                uniforms.u_resolution.value
                  .set(window.innerWidth, window.innerHeight)
                  .multiplyScalar(window.devicePixelRatio);
              }

              /*
               * Updates the uniforms when the mouse moves
               */
              function onMouseMove(event) {
                // Update the mouse uniform
                uniforms.u_mouse.value
                  .set(event.pageX, window.innerHeight - event.pageY)
                  .multiplyScalar(window.devicePixelRatio);
              }

              /*
               * Updates the uniforms when the touch moves
               */
              function onTouchMove(event) {
                // Update the mouse uniform
                uniforms.u_mouse.value
                  .set(event.pageX, window.innerHeight - event.pageY)
                  .multiplyScalar(window.devicePixelRatio);
              }

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
      )),
    ])
      .apply({
        layoutConfig: layoutConfig().fit().configAlignment(Gravity.Center),
        space: 20,
        gravity: Gravity.Center,
      })
      .in(rootView);
  }
}
