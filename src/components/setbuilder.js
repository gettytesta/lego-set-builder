import React from 'react';
import Select from 'react-select'
import axios from 'axios';
import colors from './colorlist';


class SetBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        textValue: "",
        setList: [],
        searchedPart: "",
        noRes: false,
        pieceSuccess: false,
        color: -1,
    }

    this.textChange = this.textChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleChange = this.handleChange.bind(this)
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
          searchedPart: this.state.textValue,
          pieceSuccess: false,
          noRes: false,
        })
        this.search(this.state.textValue); 
    }
  }

  handleChange = (c) => {
    this.setState({
      color: c.value
    })
  }

  search = (text) => {
    if (text.trim().length !== 0) {
      axios.post('http://127.0.0.1:5000/api/check_piece', {'part_num': text, 'color': this.state.color}).then((res) => {
        if (res.data.length === 0) {
          this.setState({
            noRes: true,
          })
        }
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
        pieceSuccess: true,
      })
    })
  }

  render() {
    return (
        <>
            <input id='legoSearchBrick' className='legoSearch' placeholder='Enter a piece' onChange={this.textChange}
                   onKeyUp={this.handleKeyPress}></input>
            <div></div>
            <div className='colorMenuTop'>
              <Select className='colorMenu' onChange={this.handleChange} options={colors}/>
            </div>
            {this.state.searchedPart.length === 0 ? <p>Enter a Lego part number to start.</p> : <></>}
            {this.state.noRes ? <p>No results...</p> : <></>}
            {this.state.pieceSuccess ? <p>Piece successfully added!</p> : <></>}
            <ul className='pieceList'>
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
