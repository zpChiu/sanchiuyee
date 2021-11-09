<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from 'axios'
import settings from './js/settings.js'
const dayjs = require('dayjs')
const today = dayjs().format('YYYY-MM-DD')
const localStorage = window.localStorage
const base64ImageCache = localStorage.getItem(today)
const style = document.createElement('style')
style.rel = 'stylesheet'
document.getElementsByTagName('HEAD').item(0).appendChild(style)

export default {
  name: 'App',
  data() {
    return {
      settings: settings,
      wallpaper: require(`./backgrounds/default.jpg`),
      color: 'blue'
    }
  },
  watch: {
    wallpaper: {
      handler(newWallpaperUrl) {
        style.innerText = `:root { --wallpaper: url('${this.wallpaper}') }`
      },
      immediate: true
    }
  },
  created() {
    // 优先取存储在localStorage的base64图片
    if (base64ImageCache !== null) {
      this.wallpaper = base64ImageCache
    } else {
      this.getWallpaperWithUnsplash()
    }
  },
  methods: {
    defaultWallpaper() {
      this.wallpaper = require(`./backgrounds/default.jpg`)
    },
    // 将图片内容转换成base64格式，并存储在localStorage
    setBase64ImageCache(imageResponse) {
      return new Promise((resolve, reject) => {
        const blob = new Blob([imageResponse], { type: 'image/jpeg' })
        const file = new FileReader()
        file.readAsDataURL(blob)
        file.onload = (e) => {
          const base64Image = e.target.result

          localStorage.clear()
          localStorage.setItem(today, base64Image)

          this.wallpaper = base64Image

          resolve()
        }
      })
    },
    // 获取壁纸图片, 图片来源 Unsplash
    getWallpaperWithUnsplash() {
      return new Promise((resolve, reject) => {
        axios.get('https://source.unsplash.com/1920x1080/daily', {
          responseType: 'blob'
        }).then(async res => {
          await this.setBase64ImageCache(res.data)
          resolve()
        }).catch((error) => {
          console.log(`获取壁纸发生错误：${error.message}`)
          this.defaultWallpaper()
        })
      })
    },
    // 获取新的壁纸图片, 图片来源 Unsplash
    getNewWallpaperWithUnsplash() {
      return new Promise((resolve, reject) => {
        axios.get('https://source.unsplash.com/1920x1080/?view', {
          responseType: 'blob'
        }).then(async res => {
          await this.setBase64ImageCache(res.data)
          resolve()
        }).catch((error) => {
          console.log(`获取新壁纸发生错误：${error.message}`)
          this.defaultWallpaper()
        })
      })
    }
  }
}
</script>

<style lang="less" src="./css/style.less"></style>
<style lang="less" vars="{ wallpaper }" scoped>
  #app {
    width: 100%;
    height: 100%;
    background-color: #fff;
    background-image: linear-gradient(to right, #fa709a 0%, #fee140 100%);
    background-image: var(--wallpaper);
    background-color: transparent;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    transition: transform 0.3s ease-out;
  }
</style>
