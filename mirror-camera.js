AFRAME.registerComponent('mirror-camera', {
  schema: {
    width: {type: 'number', default: 512},
    height: {type: 'number', default: 512}
  },

  init: function() {
    // Create render target
    this.renderTarget = new THREE.WebGLRenderTarget(
      this.data.width, 
      this.data.height,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter
      }
    );

    // Create mirror camera with flipped scale
    this.mirrorCamera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    this.mirrorCamera.scale.x = -1; // Flip horizontally
    this.el.object3D.add(this.mirrorCamera);

/*
    // Create material using render target
    this.mirrorMaterial = new THREE.MeshBasicMaterial({
      map: this.renderTarget.texture,
      side: THREE.FrontSide
    });
*/

    // Find mirror panel and update its material
    const mirrorPanel = document.querySelector('#mirrorPanel1 a-plane');
    mirrorPanel.setAttribute('material', {
      src: this.renderTarget.texture //,
     // side: 'front'
    });
  },

  tick: function() {
    const renderer = this.el.sceneEl.renderer;
    const scene = this.el.sceneEl.object3D;
    
    // Update camera position/rotation as needed
    this.mirrorCamera.position.set(0, 0, -2);
    this.mirrorCamera.lookAt(0, 0, 0);

    // Render to texture
    const currentRenderTarget = renderer.getRenderTarget();
    const currentXREnabled = renderer.xr.enabled;
    renderer.setRenderTarget(this.renderTarget);
    renderer.xr.enabled = false;
    renderer.render(scene, this.mirrorCamera);
    renderer.xr.enabled = currentXREnabled;
    renderer.setRenderTarget(currentRenderTarget);
  }
});
