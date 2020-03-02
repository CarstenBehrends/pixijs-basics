import * as THREE from "three";

export default function(angle, height, depth) {
  let h = height;
  let a = angle;
  let x = Math.tan(THREE.Math.degToRad(a * 0.5)) * h * 2;

  let triangleShape = new THREE.Shape();
  triangleShape
    .moveTo(0, 0)
    .lineTo(x * -0.5, h)
    .lineTo(x * 0.5, h)
    .lineTo(0, 0);

  var extrudeSettings = {
    steps: 2,
    depth: depth,
    bevelEnabled: false
  };

  // var geometry = new THREE.ShapeBufferGeometry(triangleShape);
  var geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

  return geometry;
}
