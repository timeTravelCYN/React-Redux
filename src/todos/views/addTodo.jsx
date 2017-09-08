import React, {Component} from 'react'
import PropTypes from 'prop-types'

import{connect} from 'react-redux'

import {addTodo} from '../actions'

class AddTodo extends Component {
  constructor(props) {
    super(props)
    this.onSubmit = this.onSubmit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
    this.state = {
      value: ''
    }
  }

  onSubmit(e) {
    e.preventDefault()

    const inputValue = this.state.value;
    if (!inputValue.trim()) {
     return;
    }

    this.props.onAdd(inputValue)

    this.setState({value: ''})
  }

  onInputChange(ev) {
    this.setState({value: ev.target.value})
  }

  render() {
    return (
      <div className="add-todo">
        <form onSubmit={this.onSubmit}>
          <input onChange={this.onInputChange} className="new-todo" value={this.state.value}/>
          <button className="add-btn" type='submit'>
            添加
          </button>
        </form>
      </div>
    )
  }
}

AddTodo.propTypes = {
  onAdd: PropTypes.func.isRequired,
}

const mapDispatchToProps = (dispatch) => {
  return {
    onAdd: (text) => {
      console.log(text)
      dispatch(addTodo(text))
    }
  }
}

export default connect(null, mapDispatchToProps)(AddTodo)