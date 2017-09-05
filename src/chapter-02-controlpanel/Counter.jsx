import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'

const buttonStyle = {
  margin: '10px'
}

class Counter extends Component {

  constructor(props) {
    super(props)
    console.log('enter constructor: ' + props.caption)

    this.onClickIncrementButton = this.onClickIncrementButton.bind(this)
    this.onClickDecrementButton = this.onClickDecrementButton.bind(this)
    this.updateProps = this.updateProps.bind(this);

    this.state = {
      count: props.initValue
    }
  }

  componentWillReceiveProps(nextProps) {
    console.log('enter componentWillReceiveProps ' + this.props.caption)
  }

  
  componentWillMount() {
    console.log('enter componentWillMount ' + this.props.caption)
  }

  componentDidMount() {
    console.log('enter componentDidMount ' + this.props.caption);
  }

  onClickIncrementButton() {
    this.setState({count: this.state.count + 1})
    this.updateProps(true)
  }
  
  onClickDecrementButton() {
    this.setState({count: this.state.count - 1})
    this.updateProps(false)
  }

  updateProps(flag) {
    const preValue = this.state.count
    const nowValue = flag ? preValue + 1 : preValue - 1
    this.setState({count: nowValue})
    this.props.onUpdate(nowValue, preValue)
  }

  shouldComponentUpdate(nextProps, nextState) {
    return (nextProps.caption !== this.props.caption) || (nextState.count !== this.state.count)
  }
  componentWillUpdate(nextProps, nextState) {
    console.log('enter componentWillUpdate')
  }

  componentDidUpdate(prevProps, prevState) {
    console.log('enter componentDidUpdate')
  }
  
  
  
  render() {
    console.log('enter render ' + this.props.caption)

    const { caption } = this.props
    return (
      <div>
        <button style={buttonStyle} onClick={this.onClickIncrementButton}>+</button>
        <button style={buttonStyle} onClick={this.onClickDecrementButton}>-</button>
        <span>{caption} count: {this.state.count}</span>
      </div>
    )
  }
}

Counter.propTypes = {
  caption: PropTypes.string.isRequired,
  initValue: PropTypes.number,
  onUpdate: PropTypes.func
}

Counter.defaultProps = {
  initValue: 0,
  onUpdate: f => f
}

export default Counter