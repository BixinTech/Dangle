import { Loader, CubeTexture } from "three";
import { TextureLoader } from "./TextureLoader";

class CubeTextureLoader extends Loader {
  constructor(manager) {
    super(manager);
  }

  load(urls, onLoad, onProgress, onError) {
    const texture = new CubeTexture();

    const loader = new TextureLoader(this.manager);
    loader.setCrossOrigin(this.crossOrigin);
    loader.setPath(this.path);

    let loaded = 0;

    function loadTexture(i) {
      loader.load(
        urls[i],
        function (image) {
          texture.images[i] = image;

          loaded++;

          if (loaded === 6) {
            texture.needsUpdate = true;

            if (onLoad) onLoad(texture);
          }
        },
        undefined,
        onError
      );
    }

    for (let i = 0; i < urls.length; ++i) {
      loadTexture(i);
    }

    return texture;
  }
}

export { CubeTextureLoader };
