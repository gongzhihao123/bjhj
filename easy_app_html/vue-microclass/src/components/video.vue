<template>
  <div class="player" ref="videoBox">
    <video-player ref="videoPlayer" :options="playerOptions" :playsinline="true">
    </video-player>
  </div>
</template>

<script>
import 'video.js/dist/video-js.css'
import { videoPlayer } from 'vue-video-player'
export default {
  props: ['src', 'poster'],
  data () {
    return {
      playerOptions: {
        start: 0,
        // height: '600',
        preload: 'none',
        playsinline: false,
        autoplay: false,
        muted: true,
        language: 'en',
        // aspectRatio: '16:9',
        // fluid: true,
        playbackRates: [0.7, 1.0, 1.5, 2.0],
        sources: [{
          type: 'video/mp4',
          src: ''
        }],
        poster: ''
      },
      scroll: ''
    }
  },
  components: {
    videoPlayer
  },
  mounted () {
    this.playerOptions.sources[0].src = this.src
    this.playerOptions.poster = this.poster
    setTimeout(() => {
      this.playerOptions.muted = false
    }, 2000)
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    }
  },
  methods: {}
}
</script>
