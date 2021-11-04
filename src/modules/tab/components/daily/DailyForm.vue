<template>
  <div v-show="true" class="container-daily_formItem">
    <mu-form ref="dailyForm" :model="formItem" label-position="left" label-width="75">
      <mu-form-item prop="content" :rules="rules.content" label="待办内容">
        <mu-text-field v-model="formItem.content" />
      </mu-form-item>
      <mu-form-item label="待办描述">
        <mu-text-field
          v-model="formItem.desc"
          multi-line
          :rows="3"
          :rows-max="6"
        />
      </mu-form-item>
      <mu-form-item label="待办时间">
        <mu-date-input
          v-model="formItem.time"
          landscape
          no-display
          type="time"
          clock-type="24hr"
          view-type="list"
        />
      </mu-form-item>
      <mu-form-item class="action-btn">
        <mu-button
          color="primary"
          :ripple="false"
          full-width
          round
          :disabled="!formItem.content"
          @click="handleToSubmit"
        >
          <mu-icon left value="playlist_add_check" />
          新增
        </mu-button>
      </mu-form-item>
    </mu-form>
  </div>
</template>

<script>
const dayjs = require('dayjs')
export default {
  name: 'DailyForm',
  props: {
    time: {
      type: [Object, Date],
      default: new Date()
    }
  },
  data() {
    return {
      formItem: {
        content: '',
        desc: '',
        time: this.time
      },
      rules: {
        content: [{ validate: (val) => !!val, message: '请填写待办内容' }]
      }
    }
  },
  watch: {
    'time'(newTime) {
      this.formItem.time = newTime
    }
  },
  methods: {
    // 提交新待办
    handleToSubmit() {
      return this.$db.add('dailyList', {
        content: this.formItem.content,
        desc: this.formItem.desc,
        date: dayjs(this.formItem.time).format('YYYY-MM-DD'),
        time: dayjs(this.formItem.time).format('YYYY-MM-DD HH:mm:00'),
        checked: false
      }).then(res => {
        this.$parent.isComponents = 'DailyList'
      })
    }
  }
}
</script>

<style scoped lang="less">
.container-daily_formItem {
  padding: 8px 16px;
  /deep/ .mu-form {
    .mu-form-item {
      margin-bottom: 8px;
      .mu-text-field-multiline {
        overflow: auto;
      }
      .mu-input-focus-line {
        height: 1px;
      }
    }
  }

  .action-btn {
    margin-top: 8px;
    /deep/ .mu-form-item-label {
      display: none;
    }
    /deep/ .mu-form-item-content {
      .mu-button {
        margin: 0!important;
      }
    }
  }
}
</style>
