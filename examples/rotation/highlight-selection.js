/* globals AFRAME */

AFRAME.registerComponent('highlight-selection', {
  dependencies: ['geojson'],
  schema: {
    text: {
      type: 'selector',
      default: '#infoText'
    },
    featureProperty: {
      default: 'name'
    }
  },

  init: function () {
    this.lastSelectedMesh = null;
    this.el.addEventListener('geojson-feature-selected', this.setText.bind(this));
  },
  setText: function (event) {
    const data = this.data;
    const {
            feature,
            mesh
        } = event.detail;

    console.log(feature[data.featureProperty]);
    if (mesh) {
      mesh.visible = true;

      if (this.lastSelectedMesh) {
        this.lastSelectedMesh.visible = false;
        this.el.object3D.remove(this.lastSelectedMesh);
      }
      this.el.object3D.add(mesh);
      this.lastSelectedMesh = mesh;
    }
  },
  tick: function (time, delta) {
    const maskMesh = this.el.components.geojson.getMaskMesh();

    const mesh = this.el.getObject3D('mesh');
    var rotation = mesh.getWorldRotation();
    var scale = mesh.getWorldScale();
    if (maskMesh) {
      maskMesh.rotation.copy(rotation);
    }

    if (this.lastSelectedMesh) {
      this.lastSelectedMesh.rotation.copy(this.el.getObject3D('mesh').rotation);
    }
  }
});