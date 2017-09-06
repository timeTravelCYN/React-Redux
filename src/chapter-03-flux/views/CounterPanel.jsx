import React, { Component } from 'react';
import Counter from './Counter'
import Summart from './Summary'

const style = {
  margin:　'20px'
}

class ControlPanel extends Component {

  render() {
    return (
      <div style={style}>
        <Counter caption="First"></Counter>
        <Counter caption="Second"></Counter>
        <Counter caption="Third"></Counter>
        <hr/>
        <Summart />
      </div>
    );
  }
}

export default ControlPanel;