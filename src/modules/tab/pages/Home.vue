<template>
  <div class="sanchiuyee-tab-view">
    <div class="layout-tab_header">
      <div class="header-right-text">
        <span @click.stop="isVisibleTodo = !isVisibleTodo; isVisibleDaily = false; ">待办</span>
        <Todo ref="todoRef" :visible="isVisibleTodo" />
      </div>
      <div class="header-right-text">
        <span @click.stop="isVisibleDaily = !isVisibleDaily; isVisibleTodo = false;">日程</span>
        <Daily ref="dailyRef" :visible="isVisibleDaily" :settings.sync="settings" />
      </div>
    </div>
    <Time :class="['layout-tab_time',{'layout-tab_time_show':currentUser.userName}]" :current-user.sync="currentUser" />
    <div class="layout-tab_bottom">
      <div class="bottom-setting">
        <div class="setting-icon" @click.stop="isVisibleSetting = !isVisibleSetting">
          <mu-icon
            size="20"
            value="settings"
            color="#C0C4CC"
          />
        </div>
        <Setting
          ref="settingRef"
          :visible.sync="isVisibleSetting"
          :settings.sync="settings"
        />
      </div>
      <div class="bottom-copyright">
        <span>图片由 Unsplash 提供</span>
        <el-tooltip
          effect="dark"
          content="换一张背景图，大约需30s"
          placement="right"
        >
          <i :class="['el-icon-refresh',{ 'el-icon_disa': isDisabledIcon }]" @click="handleReplaceBackgroundImage" />
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script>
import Time from '@/modules/tab/components/Time'
import Daily from '@/modules/tab/components/Daily'
import Todo from '@/modules/tab/components/Todo'
import Setting from '@/modules/tab/components/Setting'
import settings from '@/modules/tab/js/settings.js'
export default {
  name: 'Home',
  components: {
    Time,
    Todo,
    Daily,
    Setting
  },
  data() {
    return {
      isVisibleTodo: false,
      isVisibleDaily: false,
      isVisibleSetting: false,
      settings: settings,
      // 包含id、userName、settings
      currentUser: {},
      isDisabledIcon: false
    }
  },
  watch: {
    settings: {
      handler(newSetting, oldSetting) {
        if (JSON.stringify(oldSetting) !== JSON.stringify(settings)) {
          this.handleToSubmitUserInfo()
        }

        // 取到数据库数据后, 即执行
        this.isVisibleTodo = newSetting.isVisibleTodo
        this.isVisibleDaily = newSetting.isVisibleDaily
      },
      deep: true
    },
    currentUser: {
      handler(newCurrentUser) {
        this.settings = newCurrentUser.settings
      },
      deep: true
    }
  },

  async created() {
    await this.getUserInfo()
  },
  methods: {
    // 获取用户信息数据( 用户名称、用户设置 )
    getUserInfo() {
      return this.$db.openCursor('userInfo', (item) => true)
        .then(res => {
          if (res.data && res.data.length >= 1) {
            this.currentUser = res.data[0]
          } else {
            // 初始时新增默认数据
            return this.$db.add('userInfo', {
              userName: '请输入您的名称',
              settings: this.settings
            }).then(res => {
              if (res.code === 1) {
                return this.getUserInfo()
              }
            })
          }
        })
    },
    // 提交用户信息数据( 用户名称、用户设置 )
    handleToSubmitUserInfo() {
      this.$db
        .update('userInfo', {
          userName: this.currentUser.userName,
          settings: this.currentUser.settings
        }, this.currentUser.id)
        .then(res => {
          console.log('提交成功')
        })
    },
    // 更换新的壁纸
    handleReplaceBackgroundImage() {
      this.isDisabledIcon = true
      this.$parent.getNewWallpaperWithUnsplash().then(_ => {
        this.isDisabledIcon = false
      })
    }
  }
}
</script>

<style lang="less" scoped>
.sanchiuyee-tab-view {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;

  .layout-tab_header {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex: 0 0 auto;
    height: 60px;

    .header-right-text {
      // padding: 0 25px 0 15px;
      position: relative;
      font-size: 17px;
      font-weight: 500;
      color: #fff;
      user-select: none;
      span {
        display: inline-block;
        padding: 0 25px 0 15px;
        line-height: 60px;
      }

      /deep/ .el-badge__content.is-fixed {
        top: -2px;
        right: 3px;
      }

      &:hover {
        cursor: pointer;
      }

      &:last-child {
        // padding-right: 35px;
        span {
          padding-right: 35px;
        }
      }
    }

  }
  .layout-tab_bottom {
    display: flex;
    justify-content: space-between;
    height: 60px;
    line-height: 60px;
    .bottom-setting {
      position: relative;
      cursor: pointer;
      .setting-icon {
        padding: 0 36px;
        display: inline-block;
      }
      /deep/ .material-icons {
        vertical-align: middle;
      }
    }
    .bottom-copyright {
      margin: 0 auto;
      padding-right: 24px;
      position: relative;
      font-size: 12px;
      color: #fff;
      letter-spacing: 1px;
      .el-icon-refresh {
        position: absolute;
        top: 16px;
        right: 0;
        font-size: 14px;
        cursor: pointer;
      }
      .el-icon_disa {
        pointer-events: none;
        animation: rotate 1s linear infinite ;
      }
      @keyframes rotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
    }
  }

  .layout-tab_time {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1 1 auto;
    opacity: 0;
    transition: opacity 0.3s;;
  }
  .layout-tab_time_show {
    opacity: 1;
  }

}
</style>
