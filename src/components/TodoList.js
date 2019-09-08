import React, { Component } from 'react';
import { Button, Input, List } from 'antd'
import store from '../store/index' // 在组件中引入store
import { changeInputAction, addItemAction, deleteItemAction } from '../store/actionCreators'
class TodoList extends Component {
  constructor(props) {
    super(props);
    console.log(store)
    this.state = store.getState() // 从store中获取state数据
    store.subscribe(this.storeChange) // 订阅Redux的状态
  }

  storeChange = () => {
    this.setState(store.getState())
    
  }

  changeInputValue = (e) => {
    const action = changeInputAction(e.target.value) // action是一个对象
    store.dispatch(action) // 通过dispatch()方法将action传递给store
  }

  clickBtn = () => {
    const action = addItemAction()
    store.dispatch(action)
  }

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
    );
  }
}

export default TodoList 