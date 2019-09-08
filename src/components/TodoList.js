import React, { Component } from 'react'
import { Button, Input, List } from 'antd'
import axios from 'axios'
import store from '../store/index' // 在组件中引入store
import {
  changeInputAction,
  addItemAction,
  deleteItemAction,
  getListAction
} from '../store/actionCreators'

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

  componentDidMount() {
    // 获取远程接口数据
    axios.get('http://rap2api.taobao.org/app/mock/230515/list')
      .then((res) => {
        const data = res.data
        const action = getListAction(data)
        store.dispatch(action)
      })
  }

  /**
   * 处理输入框内容变化
   */
  changeInputValue = (e) => {
    const action = changeInputAction(e.target.value) // action是一个对象{type, value}
    store.dispatch(action) // 通过dispatch()方法将action传递给store
  }

  /**
   * 处理点击增加按钮
   */
  clickBtn = () => {
    const action = addItemAction()
    store.dispatch(action)
  }

  /**
   * 处理点击删除按钮
   */
  deleteItem = (index) => {
    const action = deleteItemAction(index)
    store.dispatch(action)
  }

  render() {
    return (
      <div style={{ margin: '10px' }}>
        <div>
          <Input
            placeholder={this.state.inputValue}
            value={this.state.inputValue}
            style={{ marginLeft: '10px', width: '250px', marginRight: '20px' }}
            onChange={this.changeInputValue}
          >
          </Input>
          <Button
            type='primary'
            onClick={this.clickBtn}
          >增加</Button>
        </div>
        <div style={{ margin: '10px', width: '500px' }}>
          <List
            bordered
            dataSource={this.state.list}
            renderItem={(item, index) => (
              <List.Item>
                <div style={{ overflow: 'hidden', width: '400px' }}>
                  {item}
                </div>
                <Button type='danger'
                  style={{ right: '3px', position: 'absolute', padding: '3px' }}
                  onClick={this.deleteItem.bind(this, index)}
                >点击删除</Button>
              </List.Item>
            )}
          />
        </div>
      </div>
    )
  }
}

export default TodoList