/**
 * @author dmarcos / https://github.com/dmarcos
 * @author mrdoob / http://mrdoob.com
 *
 * WebVR Spec: http://mozvr.github.io/webvr-spec/webvr.html
 *
 * Firefox: http://mozvr.com/downloads/
 * Chromium: https://webvr.info/get-chrome
 *
 */

THREE.MainRenderer = function( renderer, onError ) {

  this.isPresenting = false;

  var scope = this;

  var rendererSize = renderer.getSize();
  var rendererUpdateStyle = false;
  var rendererPixelRatio = renderer.getPixelRatio();

  this.setSize = function( width, height, updateStyle ) {

    rendererSize = { width: width, height: height };
    rendererUpdateStyle = updateStyle;

    renderer.setPixelRatio( rendererPixelRatio );
    renderer.setSize( width, height, updateStyle );
  };

  renderer.autoClear = false;
  renderer.autoClearColor = false;

  this.requestAnimationFrame = function( f ) {

    var f = scope.f = f || scope.f;

    if (!f) { return; }

    return window.requestAnimationFrame( f );

  };

  this.cancelAnimationFrame = function( h ) {

    var f = scope.f;

    scope.f = undefined;

    window.cancelAnimationFrame( h );

    return f;
  };

  this.render = function( scene, camera, renderTarget, forceClear, cameraData ) {

    var size = renderer.getSize();
    if (cameraData && cameraData.viewport && cameraData.viewportPosition != null && !cameraData.fullscreen) {
      
      var x, y, width = size.width / cameraData.viewport, height = cameraData.aspect ? width / cameraData.aspect : size.height / cameraData.viewport;
      switch (cameraData.viewportPosition) {
        case 0: // Top left
          x = 0; y = 0;
          break;
        case 1: // Top right
          x = size.width - width; y = 0;
          break;
        case 2: // Bottom right
          x = size.width - width; y = size.height - height;
          break;
        case 3: // Bottom left
          x = 0; y = size.height - height;
          break;
      
        default:
          break;
      }
      renderer.setViewport(x, y, width, height );
    } else {
      renderer.setViewport( 0, 0, size.width, size.height );
    }

    renderer.render( scene, camera, renderTarget, forceClear );
  };

  this.getDrawingBufferSize = function () {
    if (this.isPresentig) { this.resize(); }
    return renderer.getDrawingBufferSize();
  }

  this.getClearColor = function () {
    return renderer.getClearColor();
  }

  this.getClearAlpha = function () {
    return renderer.getClearAlpha();
  }

  this.setClearColor = function (color) {
    return renderer.setClearColor(color);
  }

};
