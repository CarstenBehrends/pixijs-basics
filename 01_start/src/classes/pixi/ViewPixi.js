import { log } from "../../utils/dev/log";
const _log = log(true, "ViewPixi");

import { gsap } from "gsap";

// import * as PIXI from "pixi.js-legacy";
import * as PIXI from "pixi.js";
//dat ui
import * as dat from "dat.gui";
const debug = true;

// utils
import Size from "./../utils/Size";
import * as EventBus from "../event/EventBus";
//three.js imports
import { HotSpot } from "./HotSpot";
import { HotspotConnections } from "./HotspotConnections";

export default class ViewPixi {
  constructor(container, data) {
    this.container = container;
    this.size = new Size(this.container);

    this.data = data;

    //https://pixijs.download/dev/docs/PIXI.Application.html
    this.app = new PIXI.Application({
      width: 300,
      height: 200,
      transparent: true,
      antialias: true,
      resolution: 2,
      forceCanvas: true,
      resizeTo: this.container
    });

    _log(this.app);

    this.container.appendChild(this.app.view);

    this.connections = new HotspotConnections();
    this.app.stage.addChild(this.connections);

    // let hotspot = new HotSpot();
    // hotspot.init({
    //   radius: 100
    // });

    // this.app.stage.addChild(hotspot);
    // hotspot.x = 500;
    // hotspot.y = 100;

    // hotspot.show();
    // hotspot.hilite();

    _log(this.size);
    this.hotspots = [];

    this.data.hotspots.forEach(hsdata => {
      let hs = new HotSpot();
      hs.name = hsdata.id;

      hs.setStartPoint({ x: hsdata.x, y: hsdata.y });

      hs.init({
        radius: hsdata.radius,
        connections: hsdata.connect,
        info: hsdata.info
      });
      hs.resize(this.size);
      this.hotspots.push(hs);

      this.app.stage.addChild(hs);
      hs.show();
    });

    //hotspot event

    this.connections.init(this.hotspots);

    //resize
    window.addEventListener("resize", this.resize.bind(this));
  }

  randomBetween(min, max) {
    return Math.random() * max + min;
  }

  start() {
    _log("START");
    this.hotspots.forEach(hs => {
      hs.start();
    });
    this.connections.start();
  }

  stop() {
    this.hotspots.forEach(hs => {
      hs.stop();
    });
    this.connections.stop();
  }

  setupHelper() {}

  setupDebug() {
    //dat gui
    if (debug) {
      this.datgui = new dat.GUI({ autoPlace: false });
      this.container.appendChild(this.datgui.domElement);
      const style = {
        position: "absolute",
        right: "0",
        top: "0",
        zIndex: "10000"
      };
      Object.assign(this.datgui.domElement.style, style);

      const datGuiCamera = this.datgui.addFolder("camera");
      //   datGuiCamera.add(this.camera, "fov", 0, 100).onChange(val => {
      //     this.camera.fov = val;
      //     this.camera.updateProjectionMatrix();
      //   });
    }
  }

  resize() {
    _log("resize");

    this.hotspots.forEach(hs => {
      hs.resize(this.size);
    });
  }
}
