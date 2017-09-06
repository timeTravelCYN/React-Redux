import React, { Component } from 'react'
import PropTypes from 'prop-types'

import * as Actions from '../Action.js'
import {connect} from 'react-redux'

const buttonStyle = {
  margin: '10px'
}

class Counter extends Component {
  render() {
    const { caption, onIncrement, onDecrement, value } = this.props

    return (
      <div>
        <button style={buttonStyle} onClick={onIncrement}>+</button>
        <button style={buttonStyle} onClick={onDecrement}>-</button>
        <span>{caption} count: {value}</span>
      </div>
    )
  }
}

Counter.propTypes = {
  caption: PropTypes.string.isRequired,
  onIncrement: PropTypes.func.isRequired,
  onDecrement: PropTypes.func.isRequired,
  value: PropTypes.number.isRequired
}

function mapState(state, ownProps) {
  return {
    value: state[ownProps.caption]
  }
}

function mapDispatch(dispatch, ownProps) {
  return {
    onIncrement: () => {
      dispatch(Actions.increment(ownProps.caption))
    },
    onDecrement: () => {
      dispatch(Actions.decrement(ownProps.caption))
    }
  }
}

export default connect(mapState, mapDispatch)(Counter)