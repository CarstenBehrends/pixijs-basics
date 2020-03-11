<template>
  <div id="app">
    <h1>pixi.js basics - 01 start</h1>

    <div class="ki-view" ref="view">
      <div class="ki-view__overlay">
        <div class="item" data-id="hs0"></div>
        <div class="item" data-id="hs1"></div>
        <div class="item" data-id="hs1_2"></div>
        <div class="item" data-id="hs2"></div>
        <div class="item" data-id="hs3"></div>
        <div class="item" data-id="hs3_2"></div>
        <div class="item" data-id="hs3_3"></div>
        <div class="item" data-id="hs4"></div>
      </div>
      <div class="ki-view__pixi"></div>
    </div>
  </div>
</template>

<script>
import ViewPixi from "./classes/pixi/ViewPixi";
import KIView from "./classes/pixi/KIView";

export default {
  name: "app",
  components: {},
  mounted() {
    let kiView = new KIView(this.$refs.view);
  }
};
</script>

<style lang="scss">
.ki-view {
  position: relative;
  z-index: 1;
  outline: 2px solid blue;
}

.ki-view__overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;

  .item {
    position: absolute;
    // outline: 1px solid purple;
    opacity: 0;
    transition: opacity 0.3s;
    &.active {
      opacity: 1;
    }

    // img {
    //   transform: translate(30px, -30%);
    // }

    &:before {
      content: attr(data-content);
      // background-color: red;
      content: "";
      display: block;
      width: 206px;
      height: 139px;
      font-size: 50px;
      transform: translate(30px, -30%);
    }

    &[data-content="0"]:before {
      background-image: url("../public/InfoBox_1.png");
    }

    &[data-content="1"]:before {
      background-image: url("../public/InfoBox_2.png");
    }
    &[data-content="2"]:before {
      background-image: url("../public/InfoBox_3.png");
    }
    &[data-content="3"]:before {
      background-image: url("../public/InfoBox_4.png");
    }
    &[data-content="4"]:before {
      background-image: url("../public/InfoBox_5.png");
    }
    &[data-content="5"]:before {
      background-image: url("../public/InfoBox_6.png");
    }
    &[data-content="6"]:before {
      background-image: url("../public/InfoBox_7.png");
    }
    &[data-content="7"]:before {
      background-image: url("../public/InfoBox_8.png");
    }
  }
}

.ki-view__pixi {
  position: relative;
  z-index: 1;
  padding-top: 50%;
  outline: 1px solid red;
  background-color: green;

  canvas {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
