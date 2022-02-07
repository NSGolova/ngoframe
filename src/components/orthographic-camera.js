var registerComponent = require('../core/component').registerComponent;
var THREE = require('../lib/three');

/**
 * Camera component.
 * Pairs along with camera system to handle tracking the active camera.
 */
module.exports.Component = registerComponent('orthographic-camera', {
  schema: {
    active: {default: false},
    far: {default: 10000},
    fov: {default: 80, min: 0},
    near: {default: 0.005, min: 0},
    viewportPosition: {default: 0},
    viewport: {default: 4},
    fullscreen: {default: false},
    frustum: {default: 1.8},
    aspect: {default: null}
  },

  /**
   * Initialize three.js camera and add it to the entity.
   * Add reference from scene to this entity as the camera.
   */
  init: function () {
    var camera;
    var el = this.el;

    // Create camera.
    const aspect = this.data.aspect || (window.innerWidth / window.innerHeight);
    const frustum = this.data.frustum;
    camera = this.camera = new THREE.OrthographicCamera(-frustum, frustum, frustum / aspect, -frustum / aspect, this.data.near, this.data.far);
    el.setObject3D('camera', camera);

    const captureThis = this;
    window.addEventListener('resize', function() {
        captureThis.update(captureThis.data);
    });
  },

  /**
   * Update three.js camera.
   */
  update: function (oldData) {
    var data = this.data;
    var camera = this.camera;
    const frustum = data.frustum;
    const aspect = data.aspect && !data.fullscreen ? data.aspect : (window.innerWidth / window.innerHeight);

    // Update properties.
    camera.fov = data.fov;
    camera.left = -frustum;
    camera.right = frustum;
    camera.top = frustum / aspect;
    camera.bottom = -frustum / aspect;
    camera.near = data.near;
    camera.far = data.far;
    camera.updateProjectionMatrix();

    this.updateActiveCamera(oldData);
  },

  updateActiveCamera: function (oldData) {
    var data = this.data;
    var el = this.el;
    var system = el.sceneEl.systems.camera;
    // spectator property did not change.
    if (oldData && oldData.active === data.active) { return; }

    // If `spectator` property changes, or first update, handle spectator camera with system.
    if (data.active) {
      // Camera enabled. Set camera to this camera.
      system.addAdditiveCamera(el);
    } else if (!data.active) {
      // Camera disabled. Set camera to another camera.
      system.removeAdditiveCamera(el);
    }
  },

  /**
   * Remove camera on remove (callback).
   */
  remove: function () {
    this.el.removeObject3D('camera');
  }
});
