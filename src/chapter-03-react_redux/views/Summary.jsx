import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

const Summary = ({sum}) => <div>Total sum: {sum}</div>

Summary.propTypes = {
  sum: PropTypes.number.isRequired
}

function mapState(state) {
  let sum = 0
  for(const key in state) {
    if(state.hasOwnProperty(key)) {
      sum += state[key]
    }
  }
  return {sum: sum}
}



export default connect(mapState)(Summary);