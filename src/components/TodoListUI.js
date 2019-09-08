import React, { Component } from 'react';
import { Button, Input, List } from 'antd'
class TodoListUI extends Component {
  constructor(props){
    super(props)
    this.state={}
  }
  render() {
    console.log(this.props)
    return (
      <div style={{ margin: '10px' }}>
        <div>
          <Input
            placeholder={this.props.inputValue}
            value={this.props.inputValue}
            style={{ marginLeft: '10px', width: '250px', marginRight: '20px' }}
            onChange={this.props.changeInputValue}
          >
          </Input>
          <Button
            type='primary'
            onClick={this.props.clickBtn}
          >增加</Button>
        </div>
        <div style={{ margin: '10px', width: '500px' }}>
          <List
            bordered
            dataSource={this.props.list}
            renderItem={(item, index) => (
              <List.Item>
                <div style={{ overflow: 'hidden', width: '400px' }}>
                  {item}
                </div>
                <Button type='danger'
                  style={{ right: '3px', position: 'absolute', padding: '3px' }}
                  onClick={() => this.props.deleteItem(index)}
                >点击删除</Button>
              </List.Item>
            )}
          />
        </div>
      </div>
    );
  }
}

export default TodoListUI