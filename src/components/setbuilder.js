import React from 'react';
import axios from 'axios';


class SetBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        textValue: "",
        setList: []
    }

    this.textChange = this.textChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }


  textChange = (event) => {
    this.setState({
      textValue: event.target.value,
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        this.search(this.state.textValue); 
    }
  }

  search = (text) => {
    if (text.trim().length !== 0) {
      axios.post('http://127.0.0.1:5000/api/check_piece', {'part_num': text}).then((res) => {
        this.setState({
          setList: res.data
        })
      })
    }
  }

  render() {
    return (
        <>
            <input className='legoSearch' placeholder='Enter a piece' onChange={this.textChange}
                   onKeyUp={this.handleKeyPress}></input>
            <ul className='pieceList'>
              {this.state.setList.map(set => {
                return <li>{"Name: " + set.set_name + " ----- SetNum: " + set._id + " ----- Total Parts: " + set.num_parts + " ----- Collected Parts: " + set.collected_pieces}</li>
              })}
            </ul>
        </>
    );
  }
}

export default SetBuilder;
