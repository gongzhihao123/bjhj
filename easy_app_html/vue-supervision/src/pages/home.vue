<template>
  <div class="home">
    <!-- <baidu-map class="bm-view" :center="center" :zoom="zoom" @ready="handler">
    </baidu-map>       -->
      <baidu-map class="map" style="display: flex; flex-direction: column" center="北京" :scroll-wheel-zoom="true" mapType="BMAP_SATELLITE_MAP">
        <bm-view style="width: 100%; height:500px; flex: 1"></bm-view>
        <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
        <bm-marker :position="{lng: 116.404, lat: 39.915}" :dragging="true" animation="BMAP_ANIMATION_BOUNCE">
          <bm-label content="我爱北京天安门" :labelStyle="{color: 'red', fontSize : '24px'}" :offset="{width: -35, height: 30}"/>
        </bm-marker>        
      </baidu-map>  
  </div>
</template>
<script>
export default {
  name: 'home',
  data () {
    return {
      center: {lng: 0, lat: 0},
      zoom: 3
    }
  },
  methods: {
    handler ({BMap, map}) {
      this.center.lng = 116.404
      this.center.lat = 39.915
      this.zoom = 15
    }
  },
  created () {

  }
}
</script>
<<style scoped lang="scss">
    .home {
      .bm-view {
        width: 90%;
        height: 800px;
        margin: 10px auto;
      }
    }
</style>


