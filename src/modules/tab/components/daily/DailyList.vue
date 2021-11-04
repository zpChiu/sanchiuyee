<template>
  <div
    :class="['daily-list',{'daily-list_empty': list.length===0}]"
    @click="contextmenu.isVisible = false"
  >
    <div
      v-for="(item,index) in list"
      :key="index"
      :class="['daily-item',{'daily-item_checked': item.checked}]"
      @contextmenu="handleContextmenu($event, item)"
    >
      <span class="daily-time">{{ dayjs(item.time).format('HH:mm') }}</span>
      <div class="daily-text">
        <p class="daily-content">{{ item.content }}</p>
        <p class="daily-desc">{{ item.desc }}</p>
      </div>
    </div>
    <!-- 右击菜单 -->
    <div
      v-show="contextmenu.isVisible"
      :style="contextmenu.style"
      class="daily-contextmenu"
    >
      <ul>
        <li @click="handleToDone">
          <mu-icon size="20" value="done_outline" />完成
        </li>
        <li @click="handleToDelete">
          <mu-icon size="20" value="delete" />删除
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
const dayjs = require('dayjs')
const docHeight = window.innerHeight
const docWidth = window.innerWidth
export default {
  name: 'DailyList',
  props: {
    time: {
      type: [Object, Date],
      default: new Date()
    }
  },
  data() {
    return {
      list: [],
      dayjs: dayjs,
      contextmenu: {
        isVisible: false,
        style: {},
        data: {}
      }
    }
  },
  watch: {
    time: {
      handler(newTime) {
        this.getDailyListToToday()
      },
      immediate: true
    }
  },
  created() {

  },
  methods: {
    // 获取当天日程列表
    getDailyListToToday() {
      const date = dayjs(this.time).format('YYYY-MM-DD')
      this.$db.openCursor('dailyList', (item) => item.date === date)
        .then(res => {
          // 排序
          this.list = res.data.sort((a, b) => (new Date(a.time)).getTime() - (new Date(b.time)).getTime())
          // 区分checked
          this.list = this.list.filter(item => !item.checked).concat(this.list.filter(item => item.checked))
        })
    },
    // 修改数据
    handleChangeDailyItem(item, isChecked) {
      const updated = Object.assign(item, {
        checked: isChecked
      })
      this.$db.update('dailyList', updated, updated.id)
        .then(res => {
          // 数据更新成功
        })
    },
    // 列表的右击事件
    handleContextmenu(event, item) {
      event.preventDefault()

      this.contextmenu.isVisible = true
      this.contextmenu.data = item

      const top = event.clientY + 10
      const left = event.clientX + 15

      this.contextmenu.style = {
        top: (top + 80) <= docHeight ? `${top}px` : `${docHeight - 80}px`,
        left: (left + 100) <= docWidth ? `${left}px` : `${docWidth - 100}px`
      }
    },
    // 完成
    handleToDone() {
      if (this.contextmenu.data.checked === false) {
        const updated = Object.assign(this.contextmenu.data, {
          checked: true
        })
        this.$db.update('dailyList', updated, updated.id)
          .then(res => {
            // 数据更新成功
          })
      }
    },
    // 删除
    handleToDelete() {
      const startIndex = this.list.findIndex(item => item.id === this.contextmenu.data.id)
      this.$db.delete('dailyList', this.contextmenu.data.id)
        .then(res => {
          if (res.code === 1) {
            // 数据删除成功
            this.list.splice(startIndex, 1)
          }
        })
    }
  }
}
</script>

<style scoped lang="less">
.daily-list {
  .daily-item {
    padding: 4px 12px 4px 12px;
    margin-bottom: 12px;
    line-height: 1.5;
    vertical-align: top;
    &:first-child {
      margin-top: 12px;
    }
    .daily-text {
      padding-left: 12px;
      display: inline-block;
      width: calc(100% - 40px);
      vertical-align: top;
    }
    .daily-time {
      font-size: 15px;
      color: #409EFF;
      vertical-align: top;
    }
    .daily-content {
      margin-bottom: 4px;
      font-size: 15px;
      font-weight: 500;
      color: #1f2f3d;
    }
    .daily-desc {
      font-size: 12px;
      color: #909399;
    }
    p {
      margin: 0;
      padding: 0;
      user-select: none;
    }
    border-top: 1px solid #EBEEF5;
    border-bottom: 1px solid #EBEEF5;
  }
  .daily-item_checked {
    background-color: #F2F6FC;
    .daily-time {
      color: #909399;
    }
    .daily-content {
      color: #909399;
    }
    .daily-desc {
      color: #C0C4CC;
    }

    span,p {
      text-decoration:line-through;
    }
  }
  /deep/ .el-checkbox {
    line-height: 1;
    .el-checkbox__inner {
      width: 16px;
      height: 16px;
      &::after {
        top: 2px;
        left: 5px;
      }
    }
  }
}
.daily-list_empty {
  position: relative;
  min-height: 100%;
  &::after {
    content: '点击右下角添加日程吧！';
    color: #C0C4CC;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 176px;
    font-size: 16px;
  }
}
.daily-contextmenu {
  display: inline-block;
  position: fixed;
  background-color: #FFF;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  ul {
    margin: 0;
    padding: 6px 0;
    list-style: none;
    li {
      padding: 0 16px;
      color: #303133;
      line-height: 32px;
      transition: all 0.15s;
      &:hover {
        cursor: pointer;
        color: #fff;
        background-color: #53a8ff;
      }
    }
    /deep/ .material-icons {
      margin-right: 6px;
      vertical-align: middle;
    }
  }
}
</style>
