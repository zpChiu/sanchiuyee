<template>
  <div v-show="isVisibleDaily" :class="['daily-popover-wrap',{'daily-popover-ani': isVisibleDaily}]">
    <div class="daily-popover daily-nipple" :style="popoverStyle">
      <mu-date-picker
        ref="muDatePicker"
        :date.sync="dailyDate"
        :first-day-of-week="1"
      >
        <template slot="day" slot-scope="{ date }">
          <div :class="['date-picker_date',{'have-dailys': listToDate.includes(dayjs(date).format('YYYY-MM-DD'))}]">
            <div class="mu-day-button-bg" />
            <span class="mu-day-button-text">{{ dayjs(date).format('DD') }}</span>
          </div>
        </template>
      </mu-date-picker>
      <div class="daily-container">
        <keep-alive>
          <transition name="fade" mode="out-in" appear>
            <component
              :is="isComponents"
              :time.sync="dailyDate"
            />
          </transition>
        </keep-alive>
      </div>
      <div class="daily-footer">
        <div class="footer-tools footer-left">
          <el-tooltip
            effect="dark"
            content="日程列表"
            placement="top"
          >
            <mu-icon value="home" color="blue" size="28" @click="isComponents='DailyList'" />
          </el-tooltip>
        </div>
        <div class="footer-tools footer-right">
          <el-tooltip
            effect="dark"
            content="新增日程"
            placement="top"
          >
            <mu-icon value="add_box" color="blue" size="32" @click="isComponents='DailyForm'" />
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import DailyForm from '@/modules/tab/components/Daily/DailyForm'
import DailyList from '@/modules/tab/components/Daily/DailyList'
const dayjs = require('dayjs')
export default {
  name: 'Daily',
  components: {
    DailyForm,
    DailyList
  },
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    settings: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      isVisibleDaily: this.visible,
      popoverStyle: {
        height: `${window.innerHeight - 60 * 2}px`
      },
      dailyDate: new Date(),
      dayjs: dayjs,
      allList: [],
      isComponents: 'DailyList',
      openFrequency: 0
    }
  },
  computed: {
    listToDate() {
      return Array.from(
        new Set(
          this.allList.filter(item => !item.checked).map(item => item.date)
        )
      ) || []
    }
  },
  watch: {
    visible(newVisible) {
      this.isVisibleDaily = newVisible

      newVisible && (this.openFrequency += 1)

      if (newVisible && this.openFrequency <= 1) {
        // 只在首次打开时, 进行数据清理
        (async _ => {
          await this.clearDataSomeDay()
          this.getDailyAllList()
        })()
      }
    }
  },
  created() {

  },
  methods: {
    handleDateChange(date) {

    },
    // 清理指定N天前的数据
    clearDataSomeDay() {
      const ONEDAY = 86400000
      const TODAY = (new Date(dayjs().format('YYYY-MM-DD 00:00:00'))).getTime()
      // N天前的时间点
      const CLEARTIME = TODAY - (this.settings.todoClearDays * ONEDAY)

      return this.$db.openCursor('dailyList', (item) => true)
        .then(res => {
          res.data.forEach(async item => {
            const t = (new Date(item.time)).getTime()
            if (t <= CLEARTIME) {
              await this.$db.delete('dailyList', item.id).then(res => {})
            }
          })
        })
    },
    // 获取所有日程数据, 以便日历上是否显示红点
    getDailyAllList() {
      return this.$db.openCursor('dailyList', (item) => true)
        .then(res => {
          // 过滤已完成的日程 ＋ 排序
          this.allList = res.data
            .filter(item => !item.checked)
            .sort((a, b) => (new Date(a.time)).getTime() - (new Date(b.time)).getTime())
        })
    }
  }
}
</script>

<style scoped lang="less">
.daily-popover-ani {
  animation: showPopover .3s 1;
  animation-fill-mode : forwards;
}
@keyframes showPopover {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.daily-popover-wrap {
  /deep/ .mu-picker {
    width: 100%;
    border-top-left-radius: 5px;
    border-top-right-radius: 5px;
    .mu-picker-display {
      padding-left: 20px;
      padding-right: 20px;
      height: 80px;
      border-top-left-radius: 4px;
      border-top-right-radius: 4px;
    }
    .mu-date-display-monthday-title {
      font-size: 32px;
      line-height: 32px;
    }
  }
}
.daily-popover-wrap {
  position: relative;
  &::after {
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    right: 42px;
    top: -7px;
    display: block;
    opacity: 1;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    // border-bottom: 7px solid rgba(255,255,255,0.98);
    border-bottom: 7px solid #2195f2;
  }
  .daily-popover {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: 20px;
    width: 320px;
    min-height: 700px;
    background: rgba(255,255,255,0.98);
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    transition: all .2s ease-out;
    transition-property: opacity,height;
    .have-dailys {
      &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 6px;
        width: 6px;
        height: 1px;
        background-color: #F56C6C;
        border-radius: 50%;
      }
    }
  }
  .daily-container {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    border-top: 1px solid rgba(0,0,0,.12);
    border-bottom: 1px solid rgba(0,0,0,.12);
    overflow: auto;

  }
  .daily-footer {
    display: flex;
    line-height: 30px;
    .footer-tools {
      padding: 0 8px;
      display: inline-block;
      width: 50%;
    }
    .footer-left {
      text-align: left;
    }
    .footer-right {
      text-align: right;
    }
    /deep/ .material-icons {
      vertical-align: middle;
      &:hover {
        cursor: pointer;
      }
    }
  }
}
</style>
