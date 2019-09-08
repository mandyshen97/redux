## react项目创建及配置
### 首先创建react项目：
```shell
creact-react-app reactdemo
```
### 修改默认配置：
对 `create-react-app` 的默认配置进行自定义，这里我们使用 [react-app-rewired](https://github.com/timarney/react-app-rewired)（一个对 create-react-app 进行自定义配置的社区解决方案）。

```shell
$ yarn add react-app-rewired customize-cra
```
修改package.json：
```json
/* package.json */
"scripts": {
-   "start": "react-scripts start",
+   "start": "react-app-rewired start",
-   "build": "react-scripts build",
+   "build": "react-app-rewired build",
-   "test": "react-scripts test",
+   "test": "react-app-rewired test",
}
```

然后在项目根目录创建一个 `config-overrides.js` 用于修改默认配置。

```javascript
module.exports = function override(config, env){
  // do staff with the webpack config...
  return config
}
```
### 配置按需加载：
[babel-plugin-import](https://github.com/ant-design/babel-plugin-import) 是一个用于**按需加载**组件代码和样式的 babel 插件（[原理](https://ant.design/docs/react/getting-started-cn#按需加载)），现在我们尝试安装它并修改 `config-overrides.js` 文件。

```shell
yarn add babel-plugin-import
```
修改`config-overrides.js`文件：
```javascript
const { override, fixBabelImports } = require('customize-cra')
module.exports = override(
  fixBabelImports('import',{
    libraryName: 'antd', // 或其他第三方组件库名称
    libiaryDirectory: 'es', // 组件位置
    style: 'css',
  })
)
```
### 配置`less`
配置`less`: 我们可以引入 `customize-cra` 中提供的 less 相关的函数 [addLessLoader](https://github.com/arackaf/customize-cra#addlessloaderloaderoptions) 来帮助加载 less 样式，同时修改 `config-overrides.js` 文件如下。

```shell
yarn add less less-loader
```

```javascript
const { override, fixBabelImports, addLessLoader } = require('customize-cra')
module.exports = override(
  fixBabelImports('import',{
    libraryName: 'antd', // 或其他第三方组件库名称
    libiaryDirectory: 'es', // 组件位置
    style: true,
  }),
  addLessLoader({
    javascriptEnabled: true,
  })
)
```
## redux的使用
![redux_flow.png]('./static/imgs/redux_flow.png')

安装redux:
```shell
yarn add redux
```
从图片中可以看出，Redux工作流程中有四个部分，最重要的就是store这个部分，因为它把所有的数据都放到了store中进行管理。在编写代码的时候，因为重要，所以要优先编写store。

### （1）创建`src/store/index.js`，就是整个项目的store文件。
```javascript
/**
 * index.js 文件就是整个项目的store文件
 */

import { createStore } from 'redux' // 引入 createStore方法
import reducer from './reducer' // 引入reducer
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__() // 使浏览器中redux-devtool插件生效
) // 创建数据存储仓库
export default store // 将仓库暴露出去
```

### （2）创建`src/store/reducer.js`，有管理能力的模块。
store只是一个仓库，它并没有管理能力，它会把接收到的action自动转发给reducer。
```javascript
/**
 * reducer暴露出去的就是一个方法函数,有两个参数：state 和 action。
 * state: 是整个项目中需要管理的数据信息。
 */

/**
 * 一定要注意： reducer里只能接收state，不能改变state。
 * 不要认为把业务逻辑写在了reducer中，那改变state值的一定是reducer。
 * 其实不然，reudcer只是返回了更改的数据，操作的是newState，但是并没有更改store中的state数据，store拿到了reducer的数据，自己对自己进行了更新。
 */
const defaultState = {} // 默认数据
export default (state = defaultState, action) => {
  if (action.type === CHANGE_INPUT) {
    let newState = JSON.parse(JSON.stringify(state)) // 深度拷贝state
    newState.inputValue = action.value
    return newState
  }
  if (action.type === ADD_ITEM) {
    let newState = JSON.parse(JSON.stringify(state))
    newState.list.push(newState.inputValue)  //push新的内容到列表中去
    newState.inputValue = ''
    return newState
  }
  // 其他类似操作流程...
  return state
}
```
### （3）组件获取state中的数据。
```javascript
import store from '../store/index' // 在组件中引入store

class TodoList extends Component {
  constructor(props) {
    super(props)
    this.state = store.getState() // 从store中获取state数据
    store.subscribe(this.storeChange) // 订阅Redux的状态
  }

  /**
   * 当订阅的redux状态变化时，使用setState()方法，将新的数据存入state中。
   */
  storeChange = () => {
    this.setState(store.getState())
  }
}
```

### (4) 创建`src/store/actionTypes.js`
如果需要action的地方我们就自己命名一个type,会出现两个基本问题：
- 这些types如果不统一管理，不利于大型项目的复用，甚至会产生冗余代码。
- 因为action里的type，一定要和reducer里的type一一对应，所以这部分代码或字母写错后，浏览器里并没有明确的报错，这给调试带来了极大的困难。

所以新建立一个actionTypes.js文件，然后把type集中放到文件中进行管理。
```javascript
export const ADD_ITEM = 'addItem'
export const // ...
// ...
```
### (5) 创建`src/store/actionCreators.js`
把所有的redux action放到一个文件里进行管理。
```javascript
import { CHANGE_INPUT, ADD_ITEM, DELETE_ITEM, GET_LIST } from './actionTypes'

export const changeInputAction = (value) => ({
  type: CHANGE_INPUT,
  value
})

export const addItemAction = () => ({
  type: ADD_ITEM
})

export const deleteItemAction = (index) => ({
  type: DELETE_ITEM,
  index
})

export const getListAction = (data) => ({
  type: GET_LIST,
  data
})

// ...
```
下面通过`button`的点击事件来熟悉redux流程。
```javascript
import React, { Component } from 'redux'
import { addItemAction } from '.././store/actionCreators'

class List extends Component {
  constructor(props){
    super(props)
    this.state = store.getState()
    store.subscribe(this.storeChange)
  }
  storeChange = () => {
    this.setState(store.getState())
  }

  clickBtn = () => {
    action = addItemAction() // 返回一个对象{type: ADD_ITEM}
    store.dispatch(action) // 通过dispatch()方法将action传递给store
  }

  render(){
    return(
      <div>
        <button onClick={this.clickBtn}>增加</button>
      <div/>
    )
  }
}
```
```javascript
// store/index.js
import { createStore } from 'redux' // 引入 createStore方法
import reducer from './reducer' // 引入reducer
const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
) // 创建数据存储仓库
export default store // 将仓库暴露出去
```
```javascript
// store/reducer.js
import { ADD_ITEM } from './actionTypes'

const defaultState = {
  inputValue: 'Write Something',
  list: []
} // 默认数据

export default (state = defaultState, action) => {
  if (action.type === ADD_ITEM) {
    let newState = JSON.parse(JSON.stringify(state))
    newState.list.push(newState.inputValue)  //push新的内容到列表中去
    newState.inputValue = ''
    return newState
  }
  return state
}
```
```javascript
// store/actionTypes.js
export const ADD_ITEM = 'addItem'
```
```javascript
// store/actionCreators.js
import { ADD_ITEM } from './actionTypes'

export const addItemAction = () => ({
  type: ADD_ITEM
})
```