<div align="center" style="position: relative;">
    <img width="40" />
    <a href="https://doric.pub">
        <img alt="Doric" src="https://doric.pub/logo.png" width="200" />
    </a>
    <img src="https://upload.wikimedia.org/wikipedia/commons/2/25/WebGL_Logo.svg" width="40" />
</div>

<br />

<div align="center">
    <a href="https://github.com/doric-pub/Dangle/blob/master/LICENSE">
        <img alt="license" src="https://img.shields.io/npm/l/dangle" />
    </a>
    <a href="https://github.com/doric-pub/Dangle/actions">
        <img alt="Actions" src="https://github.com/doric-pub/Dangle/workflows/Release/badge.svg" />
    </a>
</div>

<div align="center">
  <a href= "https://www.npmjs.com/package/dangle">
     <img src="https://img.shields.io/npm/v/dangle"/>
  </a>
  <a href="https://mvnrepository.com/artifact/pub.doric/dangle">
    <img src="https://img.shields.io/maven-central/v/pub.doric/dangle"/>
  </a>
  <a href="https://cocoapods.org/pods/Dangle">
    <img src="https://img.shields.io/cocoapods/v/Dangle"/>
  </a>
</div>
<div align="center">
 <a href="README-en.md">
    English
 </a>
</div>

# Dangle

Dangle（Doric Almost Native Graphics Layer Engine），顾名思义，是一个旨在为 Doric 提供接近原生渲染性能的图形引擎，为了最大程度拥抱 JavaScript 的生态，目前采用的是 WebGL 2.0 的协议标准。

## 特色

### JavaScript 生态

Dangle 目前支持了一系列的使用 JavaScript 函数库或者 API 并基于 WebGL 2.0 协议标准，能够在网页浏览器中创建和展示动画的三维计算机图形引擎如<a href="https://threejs.org/">Three.js</a>，<a href="https://stardustjs.github.io/">Stardust.js</a> & <a href="https://d3js.org/">D3.js</a>，<a href="https://playcanvas.com/">PlayCanvas</a>，<a href="https://www.babylonjs.com/">Babylon.js</a>，<a href="http://regl.party/">regl</a>等。其中 Three.js 支持度已经相对完善，其余的引擎后续会逐步完善支持。

### 跨平台统一

依托于 Doric 跨平台框架，Dangle 可以在 Android 和 iOS 双端呈现出一致的三维视觉交互效果。Android 端 Dangle 在<a href="https://developer.android.com/reference/android/view/TextureView">TextureView</a>上进行绘制，而在 iOS 端则是在 UIView 的<a href="https://developer.apple.com/documentation/quartzcore/caeagllayer">CAEAGLLayer</a>上进行渲染。

### 纯粹的 WebGL

即使不使用任何现有的能够在网页浏览器中创建和展示动画的三维计算机图形引擎，Dangle 也可以支持纯粹的 WebGL 函数调用，具体的示例可以参考示例展示小结之中的 MDN WebGL。

### 3D 模型资源管理

遵从 Doric 提供的 Resource 体系，可以高效管理和动态加载较大或者较为复杂的 3D 模型

## 示例展示

### Three.js

<div>
    <img src="https://user-images.githubusercontent.com/5223226/155516150-3438d6ac-9322-4fee-8021-d6bc74e0c731.jpeg" width="150"/>
    <img src="https://user-images.githubusercontent.com/5223226/155516245-e8c0df9a-4075-4402-ab56-6d327c1f3d2d.jpeg" width="150"/>
    <img src="https://user-images.githubusercontent.com/5223226/155516299-0e2261a1-68bc-44a9-af58-7ae28f541d32.jpeg" width="150"/>
    <img src="https://user-images.githubusercontent.com/5223226/155516398-e922c395-dcd3-4a4d-890f-05a7d929f7e0.jpeg" width="150"/>
    <img src="https://user-images.githubusercontent.com/5223226/155516496-1b281746-90bf-4a52-add3-c54e4ff41a19.jpeg" width="150"/>
    <img src="https://user-images.githubusercontent.com/5223226/155516632-28b56228-59cc-4e53-82e7-f623f3308474.jpeg" width="150"/>
    <img src="https://user-images.githubusercontent.com/5223226/155516747-08343de9-7ec9-4503-bfcb-084cea10932f.jpeg" width="150"/>
</div>
