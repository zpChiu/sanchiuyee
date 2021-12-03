<template>
  <div
    v-show="isVisibleTodo"
    :class="['todo-popover-wrap',{'todo-popover-ani': isVisibleTodo}]"
  >
    <div class="todo-popover todo-nipple" :style="popoverStyle">
      <div class="todo-header">
        <h3>
          <mu-icon value="playlist_add_check" color="#303133" size="24" />
          待办事项
        </h3>
        <div class="todo-tools">
          <el-tooltip
            effect="dark"
            content="清理已完成待办"
            placement="bottom"
          >
            <mu-icon value="delete_sweep" color="#909399" size="22" @click="clearDonedTodo" />
          </el-tooltip>
        </div>
      </div>
      <div
        ref="todoListRef"
        v-loading="loadingList"
        :class="['todo-list',{'todo-list-empty': list.length===0}]"
        :element-loading-text="loadingText"
      >
        <div
          v-for="(item,index) in list"
          :key="index"
          :class="['todo-item',{'todo-item_checked': item.checked}]"
        >
          <el-checkbox
            v-model="item.checked"
            @change="isChecked=>handleChangeTodoItem(item,isChecked)"
          />
          <div class="todo-text">
            <p class="todo-content">{{ item.content }}</p>
          </div>
        </div>
      </div>
      <div ref="todoTextRef" :class="['todo-filed-text']">
        <mu-text-field
          ref="muTextRef"
          v-model="todofield"
          placeholder="请输入待办内容，按Enter键结束"
          multi-line
          :rows="4"
          :rows-max="6"
          :disabled="isDisabledText||loadingList"
          @keyup.enter.native="handleToSubmitTodo"
        />
      </div>
    </div>
  </div>
</template>

<script>

const dayjs = require('dayjs')
export default {
  name: 'Todo',
  components: {

  },
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      isVisibleTodo: this.visible,
      popoverStyle: {
        height: `${window.innerHeight - 150 * 2}px`
      },
      isDisabledText: false,
      list: [],
      todofield: '',
      loadingList: false,
      loadingText: '清理中( 0 / 10 )'
    }
  },
  computed: {

  },
  watch: {
    visible(newVisible) {
      this.isVisibleTodo = newVisible
    },
    todoDate(newTodoDate) {

    }
  },
  created() {
    this.getTodoList()
  },
  methods: {
    // 获取待办列表
    getTodoList() {
      return this.$db.openCursor('todoList', (item) => true)
        .then(res => {
          // 排序
          this.list = res.data.sort((a, b) => (new Date(a.time)).getTime() - (new Date(b.time)).getTime())
          // 区分checked
          this.list = this.list.filter(item => !item.checked).concat(this.list.filter(item => item.checked))
        })
    },
    // 提交新的待办,  不允许提交空待办事件
    handleToSubmitTodo() {
      if (
        !this.todofield ||
        this.todofield === '' ||
        (/^[\r\n]+/g).test(this.todofield)
      ) {
        this.todofield = ''
        return
      }

      const submitData = {
        content: this.todofield,
        desc: '',
        time: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        checked: false
      }

      this.isDisabledText = true

      return this.$db.add('todoList', submitData).then(res => {
        const index = this.list.filter(item => !item.checked).length
        this.list.splice(index, 0, submitData)

        this.isDisabledText = false

        setTimeout(() => {
          this.todofield = ''

          this.$refs.todoListRef.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' })
          this.$refs.muTextRef.focus()
        }, 100)
      })
    },
    // 修改数据
    handleChangeTodoItem(item, isChecked) {
      const updated = Object.assign(item, {
        checked: isChecked
      })
      this.$db.update('todoList', updated, updated.id)
        .then(res => {
          // 数据更新成功
        })
    },
    async clearDonedTodo() {
      const donedList = this.list.filter(item => item.checked)
      const clear = (index, item) => {
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            this.$db.delete('todoList', item.id)
              .then(res => {
                if (res.code === 1) {
                  // 数据删除成功
                  this.loadingText = `清理中( ${index + 1} / ${donedList.length} )`
                }
                resolve()
              })
          }, 50)
        })
      }
      if (donedList.length === 0) {
        return
      }

      this.loadingList = true

      for (let i = 0; i < donedList.length; i++) {
        await clear(i, donedList[i])
      }

      await this.getTodoList()

      this.loadingList = false
    }
  }
}
</script>

<style scoped lang="less">
.todo-popover-ani {
  animation: showPopover .5s 1;
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
.todo-popover-wrap {
  position: relative;
  &::after {
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    right: 35px;
    top: -7px;
    display: block;
    opacity: 1;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    border-bottom: 7px solid #f5f5f5;
  }
  .todo-popover {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 0;
    right: -64px;
    width: 390px;
    min-height: 700px;
    background-color: #f5f5f5;
    border-radius: 5px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
    transition: all .2s ease-out;
    transition-property: opacity,height;
    background-color: #fff;
  }
  .todo-header {
    display: flex;
    flex: 0 0 auto;
    line-height: 40px;
    border-bottom: 1px solid #DCDFE6;
    h3 {
      margin: 0;
      padding: 0 16px;
      flex: 1;
      font-size: 16px;
      font-weight: 550;
      color: #303133;
    }
    .todo-tools {
      padding: 0 16px;
      flex: 1;
      text-align: right;
    }
    /deep/ .material-icons {
      vertical-align: middle;
    }
  }
  .todo-list {
    display: flex;
    flex-direction: column;
    flex: 1 1 auto;
    color: #606266;
    overflow: auto;
    .todo-item {
      padding: 4px 12px 4px 12px;
      margin-bottom: 8px;
      &:first-child {
        margin-top: 12px;
      }
      .todo-text {
        padding-left: 12px;
        display: inline-block;
        width: calc(100% - 40px);
      }
      .todo-content {
        margin-bottom: 4px;
        font-size: 15px;
        font-weight: 500;
        color: #1f2f3d;
        line-height: 1.5;
      }
      p {
        margin: 0;
        padding: 0;
        user-select: none;
      }
    }
    .todo-item_checked {
      .todo-content {
        color: #909399;
      }
      p {
        text-decoration:line-through;
      }
    }
    /deep/ .el-checkbox {
      line-height: 1.5;
      vertical-align: top;
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
  .todo-list-empty {
    position: relative;
    &::after {
      content: '暂无待办任务！';
      color: #C0C4CC;
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 16px;
    }
  }
  .todo-filed-text {
    display: flex;
    border-top: 1px solid #DCDFE6;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    /deep/ .mu-input {
      margin: 0;
      padding: 8px 0px 8px 16px;
      width: 100%;
      .mu-text-field-textarea {
        color: #606266;
      }
      .mu-input-line {
        height: 0;
      }
      .mu-input-line.disabled {
        border-bottom-width: 0;
      }
      .mu-input-focus-line {
        height: 0;
      }
    }
  }
}
</style>
