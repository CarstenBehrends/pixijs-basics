<template>
  <div id="app">
    <h1>pixi.js basics - 01 start</h1>

    <div class="view-container" ref="view">TEST</div>
  </div>
</template>

<script>
import ViewPixi from "./classes/pixi/ViewPixi";

export default {
  name: "app",
  components: {},
  mounted() {
    let view = new ViewPixi(this.$refs.view);
  }
};
</script>

<style lang="scss">
.view-container {
  position: relative;
  height: 500px;
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
