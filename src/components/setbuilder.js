import React from 'react';
import axios from 'axios';


class SetBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        textValue: "",
        setList: [],
        searchedPart: "",
    }

    this.textChange = this.textChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.addPiece = this.addPiece.bind(this)
  }


  textChange = (event) => {
    this.setState({
      textValue: event.target.value,
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        this.setState({
          searchedPart: this.state.textValue
        })
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

  addPiece = (part, set) => {
    axios.post('http://127.0.0.1:5000/api/found_piece', {'part_num': part, 'set_num': set}).then((res) => {
      document.getElementById('legoSearchBrick').value = ''
      this.setState({
        setList: [],
        textValue: "",
      })
    })
  }

  render() {
    return (
        <>
            <input id='legoSearchBrick' className='legoSearch' placeholder='Enter a piece' onChange={this.textChange}
                   onKeyUp={this.handleKeyPress}></input>
            <ul className='pieceList'>
              {/* {this.state.setList.length === 0 ? <li>Piece not contained in any sets...</li> : <></>} */}
              {this.state.setList.map(set => {
                return <li><a href='#' onClick={() => {this.addPiece(this.state.searchedPart, set._id)}}>{set.set_name}</a>
                {": " + set._id + " ----- Total: " + set.quantity + " ----- Collected: " + set.obtained_pieces}</li>
              })}
            </ul>
        </>
    );
  }
}

export default SetBuilder;
