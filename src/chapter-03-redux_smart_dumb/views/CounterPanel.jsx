import React, { Component } from 'react';
import CounterContainer from './Counter'
import SummaryContainer from './Summary'

const style = {
  margin:　'20px'
}

class ControlPanel extends Component {

  render() {
    return (
      <div style={style}>
        <CounterContainer caption="First"></CounterContainer>
        <CounterContainer caption="Second"></CounterContainer>
        <CounterContainer caption="Third"></CounterContainer>
        <hr/>
        <SummaryContainer />
      </div>
    );
  }
}

export default ControlPanel;