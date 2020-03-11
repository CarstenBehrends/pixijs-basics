import { log } from "../../utils/dev/log";
const _log = log(true, "KIView");

import ViewPixi from "./ViewPixi";
import * as EventBus from "../event/EventBus";

let overlayCount = 0;
let overlayCountMax = 7;

const data = {
  hotspots: [
    {
      id: "hs0",
      x: 15,
      y: 87,
      radius: 30,
      info: true,
      connect: ["hs1"]
    },
    {
      id: "hs1_2",
      x: 35,
      y: 15,
      info: true,
      radius: 15
    },
    {
      id: "hs1",
      x: 30,
      y: 30,
      radius: 30,
      info: true,
      connect: ["hs1_2", "hs2"]
    },

    {
      id: "hs2",
      x: 60,
      y: 32,
      radius: 30,
      info: true,
      connect: ["hs3"]
    },
    {
      id: "hs3",
      x: 80,
      y: 42,
      radius: 20,
      info: true,
      connect: ["hs4", "hs3_2", "hs3_3"]
    },
    {
      id: "hs3_2",
      x: 85,
      y: 28,
      info: true,
      radius: 15
    },
    {
      id: "hs3_3",
      x: 55,
      y: 80,
      info: true,
      radius: 15
    },
    {
      id: "hs4",
      x: 95,
      y: 42,
      info: true,
      radius: 10
    }
  ]
};

export default class KIView {
  constructor(container) {
    this.container = container;
    this.pixiContainer = this.container.querySelector(".ki-view__pixi");
    this.overlayContainer = this.container.querySelector(".ki-view__overlay");
    this.overlayItems = Array.from(
      this.overlayContainer.querySelectorAll(".item")
    );

    _log(this.overlayItems);
    let view = new ViewPixi(this.pixiContainer, data);
    view.start();

    // setTimeout(() => {
    //   view.stop();
    // }, 3000);

    // setTimeout(() => {
    //   view.start();
    // }, 6000);

    EventBus.subscribe("hotspot.found", hs => {
      _log("hotspot.found", hs.name, hs.x, hs.y);

      let item = this.getOverlayItem(hs.name);
      if (item) {
        _log("overlayCount: ", overlayCount);

        let left = (hs.x * 100) / hs.bounds.width;
        let top = (hs.y * 100) / hs.bounds.height;

        let style = {
          left: left + "%",
          top: top + "%"
        };

        Object.assign(item.style, style);

        item.classList.add("active");
        item.dataset.content = overlayCount;

        overlayCount++;
        if (overlayCount > overlayCountMax) {
          overlayCount = 0;
        }
      }
    });

    EventBus.subscribe("hotspot.search", hs => {
      // _log("hotspot.search", hs.name);
      let item = this.getOverlayItem(hs.name);
      if (item) {
        item.classList.remove("active");
      }
    });
  }

  getOverlayItem(name) {
    return this.overlayItems.find(el => el.dataset.id === name);
  }
}
