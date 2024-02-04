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
        setSuccess: false,
        color: -1,
        NewSet: undefined,
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
          setSuccess: false,
          NewSet: undefined
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
        if (Array.isArray(res.data)) {
          if (res.data.length === 0) {
            this.setState({
              noRes: true,
            })
          }
          this.setState({
            setList: res.data
          })
        } else {
          this.setState({
            NewSet: res.data
          })
        }
      })
    }
  }

  addPiece = (part, set, color) => {
    axios.post('http://127.0.0.1:5000/api/found_piece', {'part_num': part, 'set_num': set, 'color': color}).then((res) => {
      document.getElementById('legoSearchBrick').value = ''
      this.setState({
        setList: [],
        textValue: "",
        pieceSuccess: true,
        setSuccess: false,
      })
    })
  }

  addSet = (set) => {
    axios.post('http://127.0.0.1:5000/api/found_set', {'set_num': set.set_num}).then((res) => {
      document.getElementById('legoSearchBrick').value = ''
      this.setState({
        setList: [],
        textValue: "",
        setSuccess: true,
        NewSet: undefined,
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
            {this.state.setSuccess ? <p>Set successfully added!</p> : <></>}
            {this.state.NewSet === undefined ? <></> : <>
              <p>You have a piece for a set that is not currently in your setlist!</p>
              <a href='#' className='pieceIndiv' onClick={() => {this.addSet(this.state.NewSet)}}>{this.state.NewSet.name}</a>
                  <label>{": " + this.state.NewSet.set_num + " ----- Year: " + this.state.NewSet.year}</label>
              <p>Click the link to add this set to your setlist!</p>
            </>}

            <ul className='pieceList'>
              {this.state.setList.map(set => {
                return <li> 
                  <a href='#' className='pieceIndiv' onClick={() => {this.addPiece(this.state.searchedPart, set._id, set.color)}}>{set.set_name}</a>
                  <label>{": " + set._id + " ----- Color: " + set.color}</label>
                  <p className='pieceIndiv2'>Total: {set.quantity} ----- Collected: {set.obtained_pieces}</p>
                </li>
              })}
            </ul>
        </>
    );
  }
}

export default SetBuilder;
