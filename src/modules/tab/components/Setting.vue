<template>
  <div
    v-show="isVisibleSetting"
    ref="settingRef"
    :class="['setting-popover-wrap',{'setting-popover-ani': isVisibleSetting}]"
  >
    <div class="setting-popover">
      <div class="setting-menu">
        <ul>
          <li
            v-for="(item,index) in menuColumn.list"
            :key="index"
            :class="[{ 'setting-menu-actived': item.name===menuColumn.active }]"
            @click="menuColumn.active = item.name"
          >
            <mu-icon size="16" :value="item.icon" />{{ item.name }}
          </li>
        </ul>
      </div>
      <div class="setting-main">
        <div v-show="menuColumn.active==='通用'" class="setting-content setting_normal">
          <div class="setting_list">
            <!-- setting_1 -->
            <div class="setting-list_item">
              <div class="setting-label">
                <h5>是否一直显示日程</h5>
                <p>标签页打开后，一直显示“日程”工具</p>
              </div>
              <div class="setting-switch">
                <el-switch
                  v-model="settingsCopy.isVisibleDaily"
                  active-color="#13ce66"
                  inactive-color="#C0C4CC"
                  @change="settingsCopy.isVisibleDaily && (settingsCopy.isVisibleTodo = !settingsCopy.isVisibleDaily)"
                />
              </div>
            </div>
            <!-- setting_2 -->
            <div class="setting-list_item">
              <div class="setting-label">
                <h5>是否一直显示待办</h5>
                <p>标签页打开后，一直显示“待办”工具</p>
              </div>
              <div class="setting-switch">
                <el-switch
                  v-model="settingsCopy.isVisibleTodo"
                  active-color="#13ce66"
                  inactive-color="#C0C4CC"
                  @change="settingsCopy.isVisibleTodo && (settingsCopy.isVisibleDaily = !settingsCopy.isVisibleTodo)"
                />
              </div>
            </div>
            <!-- setting_3 -->
            <div class="setting-list_item">
              <div class="setting-label">
                <h5>仅保留 n 天的待办列表</h5>
                <p>会自动清理 n 天以前的待办数据</p>
              </div>
              <div class="setting-select">
                <el-select v-model="settingsCopy.todoClearDays" placeholder="请选择">
                  <el-option label="7 天" :value="7" />
                  <el-option label="14 天" :value="14" />
                  <el-option label="30 天" :value="30" />
                </el-select>
              </div>
            </div>
            <!-- setting_4 -->
            <div class="setting-list_item">
              <div class="setting-label">
                <h5>数据重置</h5>
                <p>将清空待办事项、日程所有数据，并将设置信息重置</p>
              </div>
              <div class="setting-select">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-refresh"
                  style="margin-top: 3px;"
                  @click="deleteDatabase"
                >重置</el-button>
              </div>
            </div>

          </div>
        </div>
        <div v-show="menuColumn.active==='关于'" class="setting-content setting_about">
          <div class="about-flex">
            <img src="icon/logo.png" alt="">
            <h3>
              SanChiuYee
              <a class="about-icon_github" href="https://github.com/zpChiu" target="_blank">
                <svg t="1635500229782" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2419" width="22" height="22"><path d="M511.6 76.3C264.3 76.2 64 276.4 64 523.5 64 718.9 189.3 885 363.8 946c23.5 5.9 19.9-10.8 19.9-22.2v-77.5c-135.7 15.9-141.2-73.9-150.3-88.9C215 726 171.5 718 184.5 703c30.9-15.9 62.4 4 98.9 57.9 26.4 39.1 77.9 32.5 104 26 5.7-23.5 17.9-44.5 34.7-60.8-140.6-25.2-199.2-111-199.2-213 0-49.5 16.3-95 48.3-131.7-20.4-60.5 1.9-112.3 4.9-120 58.1-5.2 118.5 41.6 123.2 45.3 33-8.9 70.7-13.6 112.9-13.6 42.4 0 80.2 4.9 113.5 13.9 11.3-8.6 67.3-48.8 121.3-43.9 2.9 7.7 24.7 58.3 5.5 118 32.4 36.8 48.9 82.7 48.9 132.3 0 102.2-59 188.1-200 212.9 23.5 23.2 38.1 55.4 38.1 91v112.5c0.8 9 0 17.9 15 17.9 177.1-59.7 304.6-227 304.6-424.1 0-247.2-200.4-447.3-447.5-447.3z" p-id="2420" /></svg>
              </a>
            </h3>
            <p>版本：v1.0.0</p>
            <div class="about-footer">
              三秋叶是一款免费、开源、美化标签页的插件，同时具备待办事项、日程功能。<br>
              感谢您对三秋叶的支持。有任何建议或疑问，请联系
              <el-tooltip content="sanchiuyee@163.com" placement="top">
                <a href="sanchiuyee@163.com">邮箱</a>
              </el-tooltip>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  components: {

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
      isVisibleSetting: this.visible,
      menuColumn: {
        list: [
          { name: '通用', icon: 'settings' },
          { name: '关于', icon: 'import_contacts' }
        ],
        active: '通用'
      },
      settingsCopy: this.settings
    }
  },
  computed: {

  },
  watch: {
    visible(newVisible) {
      this.isVisibleSetting = newVisible

      if (newVisible) {
        document.body.addEventListener('click', this.closeSetting)
      } else {
        document.body.removeEventListener('click', this.closeSetting)
      }
    },
    isVisibleSetting(newVisible) {
      this.$emit('update:visible', newVisible)
    },
    settings: {
      handler(newSettings) {
        this.settingsCopy = newSettings
      }
    }
  },
  created() {

  },
  methods: {
    closeSetting(e) {
      if (this.$refs.settingRef.contains(e.target) === false) {
        this.isVisibleSetting = false
      }
    },
    deleteDatabase() {
      const loadingInstance = this.$loading({
        fullscreen: true,
        text: '正在重置数据，请稍等...',
        background: 'rgba(0, 0, 0, 0.73)'
      })

      this.$db.deleteDatabase().then(res => {
        if (res.code === 1) {
          setTimeout(() => {
            loadingInstance.close()
            setTimeout(() => {
              window.location.reload()
            }, 100)
          }, 1300)
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.setting-popover-ani {
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
.setting-popover-wrap {
  position: absolute;
  left: 12px;
  bottom: 60px;
  width: 520px;
  height: 320px;
  background: rgba(255,255,255,0.98);
  border-radius: 5px;
  transition: all .2s ease-out;
  transition-property: opacity,height;
  &::after {
    content: '';
    height: 0;
    width: 0;
    position: absolute;
    left: 26px;
    bottom: -7px;
    display: block;
    opacity: 1;
    border-left: 7px solid transparent;
    border-right: 7px solid transparent;
    // border-bottom: 7px solid rgba(255,255,255,0.98);
    border-top: 7px solid rgba(255,255,255,0.98);

  }
  .setting-popover {
    height: 100%;

  }
  .setting-menu {
    padding: 16px 0;
    display: inline-block;
    width: 80px;
    height: 100%;
    text-align: center;
    border-right: 1px solid rgba(0,0,0,0.08);
    ul {
      margin: 0;
      padding: 0;
      li {
        padding: 4px 0;
        line-height: 30px;
        color: #606266;
        &:hover {
          color: #409eff;
          background-color: #ecf5ff;
        }
      }
      .setting-menu-actived {
        color: #409eff;
        background-color: #ecf5ff;
      }
      /deep/ .material-icons {
        margin-top: -2px;
        margin-right: 6px;
      }
    }
  }
  .setting-main {
    display: inline-block;
    width: calc(100% - 80px);
    height: 100%;
    vertical-align: top;
    .setting-content {
      margin: 16px;
      line-height: 1;
      animation: showPopover .3s 1;
      animation-fill-mode : forwards;
    }
    .setting_normal {
      margin: 0;
      height: 100%;
      overflow: auto;
      .setting_list {
        margin: 16px;
        .setting-list_item {
          margin-bottom: 16px;
          border-bottom: 1px solid #EBEEF5;
          .setting-label {
            display: inline-block;
            width: calc(100% - 80px);
            vertical-align: top;
            cursor: default;
            h5 {
              margin: 0;
              font-size: 14px;
              line-height: 20px;
            }
            p {
              margin: 0;
              padding: 8px 0;
              font-size: 12px;
              color: #909399;
            }
          }
          .setting-switch {
            display: inline-block;
            width: 80px;
            text-align: right;
            vertical-align: top;
          }
          .setting-select {
            display: inline-block;
            width: 80px;
            text-align: right;
            vertical-align: top;
            /deep/ .el-select {
              user-select: none;
              .el-input__inner {
                padding: 0;
                text-align: center;
                border: none;
                background-color: transparent;
              }
              .el-input__suffix {
                display: none!important;
              }
            }
          }
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
    }

    .setting_about {
      margin: 0;
      height: 100%;
      cursor: auto;
      .about-flex {
        padding: 70px 20px 20px 20px;
        // padding: 20px;
        position: relative;
        display: flex;
        height: 100%;
        flex-direction: column;
        align-items: center;
        // justify-content: center;
        text-align: center;
        .about-icon_github {
          display: inline-block;
          vertical-align: text-bottom;
        }
        .about-footer {
          margin-top: auto;
          position: absolute;
          bottom: 20px;
          font-size: 12px;
          color: #606266;
          line-height: 2;
          a {
            color: #409EFF;
            cursor: pointer;
          }
        }
        img {
          display: block;
          max-height: 64px;
          border-radius: 4px;
        }
        h3,p {
          margin: 0;
          padding: 0;
          letter-spacing: 1px;
        }
        h3 {
          padding: 16px;
          font-weight: 500;
          color: #303133;
        }
        p {
          font-size: 14px;
          color: #909399;
        }
      }
    }
  }
}
</style>
