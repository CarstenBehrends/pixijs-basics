import { log } from "../../utils/dev/log";
const _log = log(true, "HotspotConnections");
import * as PIXI from "pixi.js-legacy";
import { gsap } from "gsap";
export class HotspotConnections extends PIXI.Container {
  init(hotsposts) {
    this.enabled = false;
    this.hotspots = hotsposts;
    _log(this.hotspots);

    this.graphics = new PIXI.Graphics();
    this.addChild(this.graphics);

    gsap.ticker.add(this.update.bind(this));
  }

  drawLines() {
    this.graphics.clear();
    this.graphics.lineStyle(2, 0xa7e913);

    this.hotspots.forEach(hs => {
      //   _log("loop1");
      //   _log(hs.name, hs.x, hs.y);

      this.graphics.moveTo(hs.x, hs.y);

      if (hs.connections) {
        hs.connections.forEach(con => {
          //   _log("loop2");
          let chs = this.getHotspotByName(con);
          //   _log(chs.name, chs.x, chs.y);
          this.graphics.moveTo(hs.x, hs.y);
          this.graphics.lineTo(chs.x, chs.y);
        });
      }
    });
  }

  getHotspotByName(name) {
    return this.hotspots.find(el => el.name === name);
  }

  update() {
    if (this.enabled) {
      this.drawLines();
    }
  }

  start() {
    this.enabled = true;
  }
  stop() {
    this.enabled = false;
  }
}
