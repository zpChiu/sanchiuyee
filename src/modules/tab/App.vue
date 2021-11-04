<template>
  <div id="app" :style="{'background-image': `url(${backgroundImageUrl})` }">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
const dayjs = require('dayjs')
const today = dayjs().format('YYYY-MM-DD')
const localStorage = window.localStorage
const imageCache = localStorage.getItem(today)
export default {
  name: 'App',
  data() {
    return {
      backgroundImageUrl: require(`./backgrounds/${dayjs().format('DD')}.jpg`)
    }
  },
  created() {
    this.getStorageImage()
  },
  methods: {
    HandleToError() {
      this.backgroundImageUrl = require(`./backgrounds/${dayjs().format('DD')}.jpg`)
    },

    // 从localStorage获取背景图的缓存base64
    getStorageImage() {
      if (imageCache === null) {
        this.getUnsplashImage().then(imgBase64 => {
          localStorage.clear()

          localStorage.setItem(today, imgBase64)

          this.backgroundImageUrl = imgBase64
        })
      } else {
        this.backgroundImageUrl = imageCache
      }
    },

    // 请求unsplash图片, 并转换成Blob, 在本地进行缓存
    getUnsplashImage() {
      return new Promise((resolve, reject) => {
        axios.get('https://source.unsplash.com/1920x1080/daily', {
          responseType: 'blob'
        }).then((res) => {
          const blob = new Blob([res.data], { type: 'image/jpeg' })
          const file = new FileReader()
          file.readAsDataURL(blob)
          file.onload = (e) => {
            resolve(e.target.result)
          }
        }).catch((error) => {
          console.log(error)
          this.HandleToError()
        })
      })
    },

    // 请求unsplash的新背景图片, 并转换成Blob, 在本地进行缓存
    getUnsplashImageToReplace() {
      return new Promise((resolve, reject) => {
        axios.get('https://source.unsplash.com/1920x1080/?view', {
          responseType: 'blob'
        }).then((res) => {
          const blob = new Blob([res.data], { type: 'image/jpeg' })
          const file = new FileReader()
          file.readAsDataURL(blob)
          file.onload = (e) => {
            localStorage.clear()

            localStorage.setItem(today, e.target.result)

            this.backgroundImageUrl = e.target.result

            resolve()
          }
        }).catch((error) => {
          console.log(error)
          this.HandleToError()
        })
      })
    }

    // checkingImageLoadState(imgUrl) {
    //   const img = new Image()
    //   img.src = imgUrl
    //   document.body.style.opacity = 0
    //   img.onload = () => {
    //     this.backgroundImageUrl = imgUrl
    //     document.body.style.opacity = 1
    //   }
    //   img.onerror = this.HandleToError
    // },
    // getImage2pexels() {
    //   // https://www.pexels.com/ => https://api.pexels.com/v1/
    //   axios.get('https://api.pexels.com/v1/')
    //     .then(function(res) {
    //       console.log(res)
    //     }).catch(function(error) {
    //       console.log(error)
    //     })
    // }
  }
}
</script>

<style lang="less" src="./css/style.less"></style>
<style lang="less" scoped>
  #app {
    width: 100%;
    height: 100%;
    background-color: #fff;
    background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
    // background-image: url(./backgrounds/02.jpg);
    background-color: transparent;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    transition: transform 0.3s ease-out;
  }
</style>
