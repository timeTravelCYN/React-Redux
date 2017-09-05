import React, { Component } from 'react';
import Counter from './Counter'

const style = {
  margin:　'20px'
}

class ControlPanel extends Component {
  constructor(props) {
    super(props)
    this.state = {
      first: "First"
    }

    this.onPropsUpdate = this.onPropsUpdate.bind(this);
    this.update = this.update.bind(this);
    this.initValues = [0, 10, 20]
    const initSum = this.initValues.reduce((a, b) => a + b, 0)
    this.state = {
      sum: initSum
    }
  }

  update() {
    this.setState({
      first: 'hahaha'
    })
  }

  onPropsUpdate(nowVlaue, oldValue) {
    const change = nowVlaue - oldValue
    this.setState({
      sum: this.state.sum + change
    })
  }

  render() {
    return (
      <div style={style}>
        <Counter caption="First" onUpdate={this.onPropsUpdate} initValue={0}></Counter>
        <Counter caption="Second" onUpdate={this.onPropsUpdate} initValue={10}></Counter>
        <Counter caption="Third" onUpdate={this.onPropsUpdate} initValue={20}></Counter>
        <button onClick={ this.update }>Click me to re-render</button>
        <hr/>
        <div>{this.state.sum}</div>
      </div>
    );
  }
}

export default ControlPanel;