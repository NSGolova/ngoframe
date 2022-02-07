var registerComponent = require('../core/component').registerComponent;

module.exports.Component = registerComponent('position', {
  schema: {type: 'vec3'},

  update: function () {
    var object3D = this.el.object3D;
    var data = this.data;
    this.needsUpdateMatrix = true;
    object3D.position.set(data.x, data.y, data.z);

    setTimeout(() => {
      object3D.updateMatrix(true);
    }, 100);
  },

  remove: function () {
    // Pretty much for mixins.
    this.el.object3D.position.set(0, 0, 0);
  }
});
