<template>
  <div class='map-root'></div>
</template>

<script>
import { loadModules } from 'esri-loader'

export default {
  mounted() {
    loadModules([
      'esri/Map',
      'esri/views/MapView',
      'esri/widgets/Search',
    ], { css: true })
    .then(([ArcGISMap, MapView, Search]) => {
      const map = new ArcGISMap({
        basemap: 'topo-vector',
      })

      this.view = new MapView({
        container: this.$el,
        map: map,
        center: [-118, 34],
        zoom: 8,
      })

      const search = new Search({
        view: this.view,
      })

      this.view.ui.add(search, 'top-right')

      const showPopup = (address, pt) => {
        this.view.popup.open({
          title:
            +Math.round(pt.longitude * 100000) / 100000 +
            ',' +
            Math.round(pt.latitude * 100000) / 100000,
          content: address,
          location: pt,
        })
      }

      this.view.on('click', (evt) => {
        search.clear()
        this.view.popup.clear()
        if (search.activeSource) {
          const geocoder = search.activeSource.locator
          const params = {
            location: evt.mapPoint
          }
          geocoder.locationToAddress(params).then(
            (response) => {
              const address = response.address
              showPopup(address, evt.mapPoint)
            },
            (err) => {
              console.log(err)
              showPopup('No address found.', evt.mapPoint)
            }
          )
        }
      })
    })
  },
  beforeDestroy() {
    if (this.view) {
      this.view.container = null
    }
  },
}
</script>

<style scoped>
.map-root {
  padding: 0;
  margin: 0;
  width: 100%;
  height: 100%;
}
</style>