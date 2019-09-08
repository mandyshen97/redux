import {CHANGE_INPUT, ADD_ITEM, DELETE_ITEM} from './actionTypes'

const defaultState = {
  inputValue: 'Write Something',
  list: [
    '第一件事',
    '第二件事',
    '第三件事',
  ]
} // 默认数据

/**
 * 暴露出去一个方法函数,有两个参数：state 和 action。
 * state: 是整个项目中需要管理的数据信息。
 */
// Reducer里只能接收state，不能改变state。
/**
 * 不要认为把业务逻辑写在了Reducer中，那改变state值的一定是Reducer。
 * 其实不然，Reudcer只是返回了更改的数据，但是并没有更改store中的数据，store拿到了Reducer的数据，自己对自己进行了更新。
 */
export default (state = defaultState, action) => {
  console.log(state, action)
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
  if (action.type === DELETE_ITEM) {
    let newState = JSON.parse(JSON.stringify(state))
    newState.list.splice(action.index, 1) // 删除数组中对应的值
    return newState
  }
  return state
}