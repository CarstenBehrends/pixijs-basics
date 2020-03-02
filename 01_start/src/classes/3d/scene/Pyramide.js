import { log } from "../../../utils/dev/log";
const _log = log(true, "Pyramide");

import * as THREE from "three";
import { gsap } from "gsap";
import * as EventBus from "../../event/EventBus";
import Prism3D from "../objects/Prism3D";
export default class Pyramide {
  constructor() {
    // let p1 = new Prism3D(20, 20, 5, -10);
    // view3d.scene.add(p1.group);
    this.interactiveObjects = [];
    this.group = new THREE.Group();

    this.createLayer1();
    this.createLayer2();
    this.createLayer3();
    _log(this);
  }

  createLayer1() {
    this.cylinderGeometry = new THREE.CylinderBufferGeometry(26, 26, 6, 32);
    this.cylinderMaterial = new THREE.MeshPhongMaterial({
      color: 0x4080ff,
      dithering: true
    });
    this.cylinder = new THREE.Mesh(
      this.cylinderGeometry,
      this.cylinderMaterial
    );
    this.cylinder.position.y = 3;
    this.group.add(this.cylinder);
  }
  createLayer2() {
    let numItems = 8;
    let angleStep = 360 / numItems;
    let angle = 0;
    let showDelay = 0;
    this.prismGroup = new THREE.Group();
    this.prismGroup.position.y = 6.2;

    for (let i = 0; i < numItems; i++) {
      let p = new Prism3D(angleStep, 20, 6, -0.5, "prismgroup_" + i);
      this.prismGroup.add(p.group);
      p.group.rotation.y = THREE.Math.degToRad(angle);
      angle += angleStep;
      this.interactiveObjects.push(p.prismMesh);
      p.show(showDelay);
      showDelay += 0.2;
    }
    this.group.add(this.prismGroup);
  }

  createLayer3() {
    let numItems = 3;
    let angleStep = 360 / numItems;
    let angle = 0;
    let showDelay = 0;
    this.prismGroup = new THREE.Group();
    this.prismGroup.position.y = 12.4;

    for (let i = 0; i < numItems; i++) {
      let p = new Prism3D(angleStep, 10, 6, 0, "prismgroup_" + i);
      this.prismGroup.add(p.group);
      p.group.rotation.y = THREE.Math.degToRad(angle);
      angle += angleStep;
      this.interactiveObjects.push(p.prismMesh);
      p.show(2);
    }
    this.group.add(this.prismGroup);
  }
}
