class IndexDB {
  constructor() {
    this.databaseName = 'SanChiuYee'
    this.request = null
    this.dbInstance = null
    this.readyState = null
    this.checkedTimer = null
    this.open()
  }
  /**
   *  @description 打开数据库
   *  @returns 返回Promise
   */
  open() {
    this.request = window.indexedDB.open(this.databaseName, 1)

    this.request.onsuccess = event => {
      this.dbInstance = event.target.result
      this.readyState = this.request.readyState
    }

    // 若需要创表, 只能通过onupgradeneeded事件, 而onupgradeneeded事件只能在数据库升级才调用, 因此创表只能修改数据表版本等级
    this.request.onupgradeneeded = event => {
      this.dbInstance = event.target.result
      this.createObjectStore()
    }
  }
  createObjectStore() {
    if (!this.dbInstance.objectStoreNames.contains('todoList')) {
      console.log('todoList表 创建成功')

      // todoList表
      const objectStore = this.dbInstance.createObjectStore('todoList', { autoIncrement: true })

      objectStore.createIndex('content', 'content', { unique: false })
      objectStore.createIndex('desc', 'desc', { unique: false })
      objectStore.createIndex('time', 'time', { unique: false })
      objectStore.createIndex('checked', 'checked', { unique: false })
    }

    if (!this.dbInstance.objectStoreNames.contains('dailyList')) {
      // dailyList表
      const objectStore = this.dbInstance.createObjectStore('dailyList', { autoIncrement: true })

      objectStore.createIndex('content', 'content', { unique: false })
      objectStore.createIndex('desc', 'desc', { unique: false })
      objectStore.createIndex('date', 'date', { unique: false })
      objectStore.createIndex('time', 'time', { unique: false })
      objectStore.createIndex('checked', 'checked', { unique: false })
    }

    if (!this.dbInstance.objectStoreNames.contains('userInfo')) {
      // userInfo表
      const objectStore = this.dbInstance.createObjectStore('userInfo', { autoIncrement: true })

      objectStore.createIndex('userName', 'userName', { unique: false })
      objectStore.createIndex('setting', 'setting', { unique: false })
    }
  }
  checkReadyState() {
    return new Promise((resolve, reject) => {
      const checkedIDBState = () => {
        this.checkedTimer = setTimeout(() => {
          if (this.readyState !== 'done') {
            checkedIDBState()
          } else {
            this.checkedTimer = null
            resolve()
          }
        }, 100)
      }
      checkedIDBState()
    })
  }
  /**
   *  @description 对一个数据表进行数据新增
   *  @returns 返回Promise, 包含成功/失败结果
   */
  add(tableName, data) {
    return new Promise((resolve, reject) => {
      var request = this.dbInstance.transaction([tableName], 'readwrite')
        .objectStore(tableName)
        .add(data)

      request.onsuccess = (event) => {
        resolve({
          code: 1,
          msg: '数据新增成功',
          data: Object.assign(data, {
            id: request.result
          })
        })
      }
      request.onerror = (event) => {
        resolve({
          code: 0,
          msg: '数据新增失败'
        })
      }
    })
  }
  /**
   *  @description 对一个数据表进行数据读取
   *  @returns 返回Promise, 包含成功/失败结果
   *  @notices objectStore.get()方法用于读取数据，参数是主键的值
   */
  get(tableName, keyValue) {
    return new Promise((resolve, reject) => {
      this.checkReadyState().then(_ => {
        var request = this.dbInstance.transaction([tableName])
          .objectStore(tableName)
          .get(keyValue)

        request.onsuccess = (event) => {
          resolve({
            code: 1,
            msg: '查找成功',
            data: event.target.result
          })
        }
        request.onerror = (event) => {
          resolve({
            code: 0,
            msg: '查找失败',
            data: {}
          })
        }
      })
    })
  }
  /**
   *  @description 对一个数据表的数据进行索引搜索
   *  @returns 返回Promise, 包含成功/失败结果
   *  @notices 索引的意义在于，可以让你搜索任意字段，也就是说从任意字段拿到数据记录。如果不建立索引，默认只能搜索主键（即从主键取值）。
   */
  search(tableName, indexName, indexValue) {
    return new Promise((resolve, reject) => {
      var request = this.dbInstance.transaction([tableName], 'readonly')
        .objectStore(tableName)
        .index(indexName)
        .get(indexValue)

      request.onsuccess = (event) => {
        resolve({
          code: 1,
          msg: '查找成功',
          data: event.target.result
        })
      }
      request.onerror = (event) => {
        resolve({
          code: 0,
          msg: '查找失败',
          data: {}
        })
      }
    })
  }
  /**
   *  @description 使用游标进行查询
   *  @returns 返回Promise, 包含成功/失败结果
   *  @param { String } tableName 表名
   *  @param { Function } fn 条件判断函数, 返回布尔值
   *  @notices
   */
  openCursor(tableName, fn) {
    return new Promise((resolve, reject) => {
      this.checkReadyState().then(_ => {
        var request = this.dbInstance.transaction(tableName, 'readwrite')
          .objectStore(tableName)
          .openCursor()
        const data = []

        request.onsuccess = (event) => {
          const res = event.target.result
          if (res) {
            fn(res.value) && data.push(Object.assign({
              id: res.key
            }, res.value))

            res.continue()
          } else {
            resolve({
              code: 1,
              msg: '查找成功',
              data: data
            })
          }
        }
        request.onerror = (event) => {
          resolve({
            code: 0,
            msg: '查找失败',
            data: {}
          })
        }
      })
    })
  }
  /**
   *  @description 根据ID值, 更新指定数据
   *  @returns 返回Promise, 包含成功/失败结果
   *  @param { String } tableName 表名
   *  @param { Object } data 更新的数据, 含ID值
   */
  update(tableName, data, updateId) {
    return new Promise((resolve, reject) => {
      var request = this.dbInstance.transaction(tableName, 'readwrite')
        .objectStore(tableName)
        .put(data, updateId)

      request.onsuccess = (event) => {
        resolve({
          code: 1,
          msg: '更新成功',
          data: data
        })
      }
      request.onerror = (event) => {
        resolve({
          code: 0,
          msg: '更新失败',
          data: {}
        })
      }
    })
  }
  /**
   *  @description 根据ID值, 删除指定数据
   *  @returns 返回Promise, 包含成功/失败结果
   *  @param { String } tableName 表名
   *  @param { Object } deleteKey 删除的Key值, 即ID值
   */
  delete(tableName, deleteKey) {
    return new Promise((resolve, reject) => {
      var request = this.dbInstance.transaction(tableName, 'readwrite')
        .objectStore(tableName)
        .delete(deleteKey)

      request.onsuccess = (event) => {
        resolve({
          code: 1,
          msg: '删除成功'
        })
      }
      request.onerror = (event) => {
        resolve({
          code: 0,
          msg: '删除失败'
        })
      }
    })
  }
  /**
   *  @description 删除数据库
   *  @returns 返回Promise, 包含成功/失败结果
   */
  deleteDatabase() {
    return new Promise((resolve, reject) => {
      try {
        window.indexedDB.deleteDatabase(this.databaseName)
        resolve({
          code: 1,
          msg: '删除成功'
        })
      } catch (error) {
        resolve({
          code: 0,
          msg: error.message
        })
      }
    })
  }
}

export default new IndexDB()
