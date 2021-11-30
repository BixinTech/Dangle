import {
  Panel,
  Group,
  vlayout,
  layoutConfig,
  Gravity,
  navbar,
  stack,
} from "doric";
import { dangleView, getGl, vsync } from "dangle";

import * as THREE from "three";
import {
  RollerCoasterGeometry,
  RollerCoasterShadowGeometry,
  RollerCoasterLiftersGeometry,
  TreesGeometry,
  SkyGeometry
} from './jsm/misc/RollerCoaster';

@Entry
class webxr_vr_rollercoaster extends Panel {
  onShow() {
    navbar(context).setTitle("webxr_vr_rollercoaster");
  }
  build(rootView: Group) {
    vlayout([
      stack(
        [
          dangleView({
            onPrepared: (glContextId, width, height) => {
              let gl = getGl(glContextId) as any;

              const inputCanvas = 
              ({
                width: width,
                height: height,
                style: {},
                addEventListener: (() => {}) as any,
                removeEventListener: (() => {}) as any,
                clientHeight: height,
                getContext: (() => {return gl}) as any,
              } as HTMLCanvasElement);

              let window = {
                innerWidth: width,
                innerHeight: height,
                devicePixelRatio: 1,
                addEventListener: (() => {}) as any
              }

              let requestAnimationFrame = vsync(context).requestAnimationFrame
              
              //#region code to impl
              
              let mesh, material, geometry;

              const renderer = new THREE.WebGLRenderer( { antialias: true, canvas: inputCanvas } );
              renderer.setPixelRatio( window.devicePixelRatio );
              renderer.setSize( window.innerWidth, window.innerHeight );
              renderer.xr.enabled = true;
              renderer.xr.setReferenceSpaceType( 'local' );
              // document.body.appendChild( renderer.domElement );

              // document.body.appendChild( VRButton.createButton( renderer ) );

              //

              const scene = new THREE.Scene();
              scene.background = new THREE.Color( 0xf0f0ff );

              const light = new THREE.HemisphereLight( 0xfff0f0, 0x606066 );
              light.position.set( 1, 1, 1 );
              scene.add( light );

              const train = new THREE.Object3D();
              scene.add( train );

              const camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 500 );
              train.add( camera );

              // environment

              geometry = new THREE.PlaneGeometry( 500, 500, 15, 15 );
              geometry.rotateX( - Math.PI / 2 );

              const positions = geometry.attributes.position.array;
              const vertex = new THREE.Vector3();

              for ( let i = 0; i < positions.length; i += 3 ) {

                vertex.fromArray( positions, i );

                vertex.x += Math.random() * 10 - 5;
                vertex.z += Math.random() * 10 - 5;

                const distance = ( vertex.distanceTo( scene.position ) / 5 ) - 25;
                vertex.y = Math.random() * Math.max( 0, distance );

                vertex.toArray( positions, i );

              }

              geometry.computeVertexNormals();

              material = new THREE.MeshLambertMaterial( {
                color: 0x407000
              } );

              mesh = new THREE.Mesh( geometry, material );
              scene.add( mesh );

              geometry = new TreesGeometry( mesh );
              material = new THREE.MeshBasicMaterial( {
                side: THREE.DoubleSide, vertexColors: true
              } );
              mesh = new THREE.Mesh( geometry, material );
              scene.add( mesh );

              geometry = new SkyGeometry();
              material = new THREE.MeshBasicMaterial( { color: 0xffffff } );
              mesh = new THREE.Mesh( geometry, material );
              scene.add( mesh );

              //

              const PI2 = Math.PI * 2;

              const curve = ( function () {

                const vector = new THREE.Vector3();
                const vector2 = new THREE.Vector3();

                return {

                  getPointAt: function ( t ) {

                    t = t * PI2;

                    const x = Math.sin( t * 3 ) * Math.cos( t * 4 ) * 50;
                    const y = Math.sin( t * 10 ) * 2 + Math.cos( t * 17 ) * 2 + 5;
                    const z = Math.sin( t ) * Math.sin( t * 4 ) * 50;

                    return vector.set( x, y, z ).multiplyScalar( 2 );

                  },

                  getTangentAt: function ( t ) {

                    const delta = 0.0001;
                    const t1 = Math.max( 0, t - delta );
                    const t2 = Math.min( 1, t + delta );

                    return vector2.copy( this.getPointAt( t2 ) )
                      .sub( this.getPointAt( t1 ) ).normalize();

                  }

                };

              } )();

              geometry = new RollerCoasterGeometry( curve, 1500 );
              material = new THREE.MeshPhongMaterial( {
                vertexColors: true
              } );
              mesh = new THREE.Mesh( geometry, material );
              scene.add( mesh );

              geometry = new RollerCoasterLiftersGeometry( curve, 100 );
              material = new THREE.MeshPhongMaterial();
              mesh = new THREE.Mesh( geometry, material );
              mesh.position.y = 0.1;
              scene.add( mesh );

              geometry = new RollerCoasterShadowGeometry( curve, 500 );
              material = new THREE.MeshBasicMaterial( {
                color: 0x305000, depthWrite: false, transparent: true
              } );
              mesh = new THREE.Mesh( geometry, material );
              mesh.position.y = 0.1;
              scene.add( mesh );

              const funfairs: any[] = [];

              //

              geometry = new THREE.CylinderGeometry( 10, 10, 5, 15 );
              material = new THREE.MeshLambertMaterial( {
                color: 0xff8080
              } );
              mesh = new THREE.Mesh( geometry, material );
              mesh.position.set( - 80, 10, - 70 );
              mesh.rotation.x = Math.PI / 2;
              scene.add( mesh );

              funfairs.push( mesh );

              geometry = new THREE.CylinderGeometry( 5, 6, 4, 10 );
              material = new THREE.MeshLambertMaterial( {
                color: 0x8080ff
              } );
              mesh = new THREE.Mesh( geometry, material );
              mesh.position.set( 50, 2, 30 );
              scene.add( mesh );

              funfairs.push( mesh );

              //

              window.addEventListener( 'resize', onWindowResize );

              function onWindowResize() {

                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();

                renderer.setSize( window.innerWidth, window.innerHeight );

              }

              //

              const position = new THREE.Vector3();
              const tangent = new THREE.Vector3();

              const lookAt = new THREE.Vector3();

              let velocity = 0;
              let progress = 0;

              let prevTime = Date.now();

              function render() {

                const time = Date.now();
                const delta = time - prevTime;

                for ( let i = 0; i < funfairs.length; i ++ ) {

                  funfairs[ i ].rotation.y = time * 0.0004;

                }

                //

                progress += velocity;
                progress = progress % 1;

                position.copy( curve.getPointAt( progress ) );
                position.y += 0.3;

                train.position.copy( position );

                tangent.copy( curve.getTangentAt( progress ) );

                velocity -= tangent.y * 0.0000001 * delta;
                velocity = Math.max( 0.00004, Math.min( 0.0002, velocity ) );

                train.lookAt( lookAt.copy( position ).sub( tangent ) );

                //

                renderer.render( scene, camera );

                prevTime = time;

                gl.flush();
                gl.endFrameEXP();
              }

              // renderer.setAnimationLoop( render );
              function animate() {

                vsync(context).requestAnimationFrame( animate );
                render();
    
              }
              animate()
              
              //#endregion

              gl.flush();
              gl.endFrameEXP();
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