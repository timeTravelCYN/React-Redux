import React, { Component } from 'react';

import store from '../Store.js';

const Summary = ({sum}) => <div>Total sum: {sum}</div>

class SummaryContainer extends Component {
  constructor(props, context) {
    super(props, context);

    this.onChange = this.onChange.bind(this);

    this.state = this.getOwnState();
  }

  onChange() {
    this.setState(this.getOwnState());
  }

  getOwnState() {
    const state = this.context.store.getState();
    let sum = 0;
    for (const key in state) {
      if (state.hasOwnProperty(key)) {
        sum += state[key];
      }
    }

    return { sum: sum };
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.sum !== this.state.sum;
  }

  componentDidMount() {
    store.subscribe(this.onChange);
  }

  componentWillUnmount() {
    store.unsubscribe(this.onChange);
  }

  render() {
    const sum = this.state.sum;
    return <Summary sum={sum}/>
  }
}

SummaryContainer.contextType = {
  store: PropTypes.object
}

export default SummaryContainer;