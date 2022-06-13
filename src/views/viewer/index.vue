<template>
  <div class="viewer">
    <div class="map" id="map">
    </div>
  </div>
</template>

<script setup>
import 'ol/ol.css'
import Map from 'ol/Map'
import View from 'ol/View'
import { Vector as VectorLayer, WebGLTile as TileLayer } from 'ol/layer'
import { OSM, Vector as VectorSource } from 'ol/source'
import { ref, shallowRef, onMounted } from 'vue'
import { useDrawLayerStyle } from './components/hooks/useStyle'

const map = ref(null)

const initMap = () => {
  // 图像底图
  const tileLayer = new TileLayer({
    name: 'imageLayer',
    source: new OSM()
  })
  const drawLayer = new VectorLayer({
    name: 'drawLayer',
    source: new VectorSource(),
    style: useDrawLayerStyle
  })
  console.log(drawLayer)
  map.value = new Map({
    layers: [tileLayer, drawLayer],
    target: 'map',
    view: new View({
      /* constrainResolution: true,
      resolutions: [512, 256, 128, 64, 32, 16, 8, 4, 2, 1] */
      // center: [-11000000, 4600000], // 暂时没有center属性地图不会显示
      center: new OSM().getTileGrid().getExtent(),
      zoom: 4,
      extent: [-40075016.68557849, -20037508.342789244, 40075016.68557849, 20037508.342789244]
    })
  })
}

onMounted(() => {
  initMap()
})


</script>

<style lang="scss" scoped>
.el-main {
  padding: 0;
}
.viewer {
  width: 100%;
  .map {
    width: 100%;
    height: calc(100vh - 100px);
  }
}

</style>