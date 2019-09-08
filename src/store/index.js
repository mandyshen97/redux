/**
 * index.js 文件就是整个项目的store文件
 */

import { createStore } from 'redux' // 引入 createStore方法
import reducer from './reducer' // 引入reducer
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) // 创建数据存储仓库
export default store // 将仓库暴露出去