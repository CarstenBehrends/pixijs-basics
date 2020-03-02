import { log } from "../../utils/dev/log";
const _log = log(true, "PickHelper");
const DEBUG = true;

import * as THREE from "three";
import * as EventBus from "./../event/EventBus";

export default class PickHelper {
  constructor() {
    this.raycaster = new THREE.Raycaster();
    this.pickedObject = null;
    this.pickedObjectSavedColor = 0;
  }
  pick(normalizedPosition, camera, objects, time) {
    // cast a ray through the frustum
    this.raycaster.setFromCamera(normalizedPosition, camera);
    // get the list of objects the ray intersected
    const intersectedObjects = this.raycaster.intersectObjects(objects);

    // _log(intersectedObjects.length);

    if (intersectedObjects.length) {
      // pick the first object. It's the closest one
      let current = intersectedObjects[0].object;

      if (DEBUG) {
        current.material.emissive.setHex(current.userData.ocolor);
      }

      if (current !== this.pickedObject) {
        this.pickedObject = current;
        // _log(this.pickedObject);

        if (DEBUG) {
          // save its color
          this.pickedObject.userData.ocolor = this.pickedObject.material.emissive.getHex();
          // set its emissive color to flashing red/yellow
          this.pickedObject.material.emissive.setHex(0xffffff);
        }

        EventBus.publish("3dobject.pick", this.pickedObject);
      }
    } else {
      if (this.pickedObject) {
        // _log("no object");
        if (DEBUG) {
          this.pickedObject.material.emissive.setHex(
            this.pickedObject.userData.ocolor
          );
        }
        EventBus.publish("3dobject.pick", null);
      }

      this.pickedObject = null;
    }
  }
}
