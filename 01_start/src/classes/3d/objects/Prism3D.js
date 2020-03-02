import { log } from "../../../utils/dev/log";
const _log = log(true, "Prism");

import * as THREE from "three";
import { gsap } from "gsap";

export default class Prism3D {
  constructor(angle = 60, height = 10, depth = 5, offsetZ = 0, name = "") {
    this.height = height;
    this.angle = angle;
    this.depth = depth;
    this.offsetZ = offsetZ;
    this.name = name;
    this.group = new THREE.Group();
    this.material = new THREE.MeshPhongMaterial({
      color: 0x4080ff,
      dithering: true
    });

    this.prismGeometry = this.prismGeometry();
    this.prismMesh = new THREE.Mesh(this.prismGeometry, this.material);
    this.prismMesh.position.z = this.offsetZ;
    this.group.add(this.prismMesh);

    // clickable plane
    // this.planeGeometry = new THREE.PlaneGeometry(this.width, this.depth);
    // this.planeMesh = new THREE.Mesh(this.planeGeometry, this.material);
    // this.group.add(this.planeMesh);

    this.prismMesh.rotation.x = THREE.Math.degToRad(-90);
    this.prismMesh.name = this.name;
    // this.prismMesh;
    this.group.scale.set(0.0001, 0.0001, 0.0001);
  }

  show(delay) {
    gsap.to(this.group.scale, {
      duration: 0.5,
      delay: delay,
      x: 1,
      y: 1,
      z: 1
    });
  }

  prismGeometry() {
    this.width =
      Math.tan(THREE.Math.degToRad(this.angle * 0.5)) * this.height * 2;

    let triangleShape = new THREE.Shape();
    triangleShape
      .moveTo(0, 0)
      .lineTo(this.width * -0.5, this.height)
      .lineTo(this.width * 0.5, this.height)
      .lineTo(0, 0);

    var extrudeSettings = {
      steps: 2,
      depth: this.depth,
      bevelEnabled: false
    };

    // var geometry = new THREE.ShapeBufferGeometry(triangleShape);
    var geometry = new THREE.ExtrudeGeometry(triangleShape, extrudeSettings);

    return geometry;
  }
}
