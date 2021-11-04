<template>
  <div class="tab-time">
    <div class="clocks">
      <span class="clock-time">{{ cpt_hh }}:{{ cpt_mm }}</span>
      <span class="clock-s">{{ cpt_ss }}</span>
    </div>
    <div class="greetings">
      <span>{{ greetings[hh] }}好，</span>
      <span
        ref="username"
        :class="['user_name',{'contenteditable-anim': isContenteditable}]"
        :contenteditable="isContenteditable"
        @keydown="handleToSubmitUserName"
      >{{ currentUser.userName }}</span>
      <i :class="['el-icon-edit-outline']" @click="handleToEditUserName" />
    </div>
  </div>
</template>

<script>
import greetings from '../js/greetings'
const dayjs = require('dayjs')
export default {
  name: 'Time',
  props: {
    currentUser: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      // 问候语
      greetings: greetings,
      hh: 0,
      mm: 0,
      ss: 0,
      isContenteditable: false
    }
  },
  computed: {
    cpt_hh() {
      return this.hh < 10 ? '0' + this.hh : this.hh
    },
    cpt_mm() {
      return this.mm < 10 ? '0' + this.mm : this.mm
    },
    cpt_ss() {
      return this.ss < 10 ? '0' + this.ss : this.ss
    },
    todoDate_start() {
      return new Date(`${dayjs(this.todoDate).format('YYYY-MM-DD')} 00:00:00`).getTime()
    },
    todoDate_end() {
      return new Date(`${dayjs(this.todoDate).format('YYYY-MM-DD')} 23:59:59`).getTime()
    }
  },
  mounted() {
    this.handleShowTimes()
    setInterval(this.handleShowTimes, 1000)
  },
  methods: {
    handleShowTimes() {
      const t = new Date()
      this.hh = t.getHours()
      this.mm = t.getMinutes()
      this.ss = t.getSeconds()
    },
    // 提交用户名
    async handleToSubmitUserName(e) {
      if (e.keyCode === 13) {
        this.isContenteditable = false
        this.currentUser.userName = e.target.innerText

        await this.$db.update('userInfo', this.currentUser, this.currentUser.id).then(res => {
          if (res.code === 1) {
            this.$emit('update:currentUser', this.currentUser)
          }
        })

        e.preventDefault()
        return false
      }
    },
    // 编辑用户名
    handleToEditUserName() {
      this.isContenteditable = true
      setTimeout(() => {
        this.$refs.username.focus()
        const range = document.createRange()
        range.selectNodeContents(this.$refs.username)
        range.collapse(false)
        const sel = window.getSelection()
        sel.removeAllRanges()
        sel.addRange(range)
      }, 100)
    }
  }
}
</script>

<style scoped lang="less">
.tab-time{
  text-align: center;
  color: #fff;
  line-height: 1.3;
  .clocks {
    text-align: center;
    user-select: none;
  }
  .clock-time {
    font-size: 152px;
    font-weight: 500;
  }
  .clock-s {
    padding-left: 32px;
    font-size: 40px;
    font-weight: 500;
  }
  .greetings {
    position: relative;
    font-size: 48px;
    letter-spacing: 2px;

    span {
      display: inline-block;
      vertical-align: middle;
    }
    .user_name {
      padding: 0 6px;
      max-width: 520px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
      border-radius: 4px;
      border-bottom: 2px solid transparent;
      &:focus-visible {
        outline-width: 0;
        border-bottom-left-radius: 0;
        border-bottom-right-radius: 0;
        border-bottom: 2px solid #fff;
      }
    }
    .contenteditable-anim {
      animation: twinkling 1s;
      transition: background-color 0.8s;
    }
    @keyframes twinkling {
      0% {
        background-color: transparent;
      }
      50% {
        background-color: rgba(255, 255, 255, 0.3);
      }
      100% {
        background-color: transparent;
      }
    }
    .el-icon-edit-outline {
      padding-left: 16px;
      position: absolute;
      display: none;
      font-size: 18px;
      cursor: pointer;
      animation: opacity 0.8s;
      transition: all 0.5;
    }
    @keyframes opacity {
      0% {
        opacity: 0;
      }
      100% {
        opacity: 1;
      }
    }
    &::after {
      content: "";
    }
    &:hover {
        > .el-icon-edit-outline {
          display: inline-block;
        }
      }
  }
  // 渐变色 Start
  .gradient {
    background-image: linear-gradient(45deg, #a66ae2 0%, #357ebf 50%, #88d651 100%);
    background-size: 400%;
    background-position: 0 100%;
    animation: gradient 7.5s ease-in-out infinite;
  }
  @keyframes gradient {
    50% {
      background-position: 100% 0;
    }
  }
  // 渐变色 End
}
</style>
