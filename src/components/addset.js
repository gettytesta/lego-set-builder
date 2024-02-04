import React from 'react';
import axios from 'axios';


class AddSet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        textValue: "",
        setSearch: {},
        searchedYet: false,
        addedSet: false,
    }

    this.textChange = this.textChange.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.search = this.search.bind(this)
    this.addSet = this.addSet.bind(this)
  }

  textChange = (event) => {
    this.setState({
      textValue: event.target.value,
    })
  }

  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
        this.setState({
            addedSet: false
        })
        this.search(this.state.textValue); 
    }
  }

  search = (text) => {
    if (text.trim().length !== 0) {
        axios.post('http://127.0.0.1:5000/api/find_set', {'set_num': text}).then((res) => {
          this.setState({
            setSearch: res.data,
            searchedYet: true,
          })
        })
      }
  }

  addSet = (set) => {
    axios.post('http://127.0.0.1:5000/api/found_set', {'set_num': set.set_num}).then((res) => {
      this.setState({
        setSearch: {},
        searchedYet: true,
        addedSet: true,
      })
    })
  }

  render() {
    return (
        <>
            <input id='legoSearchBrick' className='legoSearch' placeholder='Enter a set' onChange={this.textChange}
                    onKeyUp={this.handleKeyPress}></input>
            {Object.keys(this.state.setSearch).length === 0 ? <></> : <ul className='pieceList'>
                <li><a href='#' onClick={() => {this.addSet(this.state.setSearch)}}>{this.state.setSearch.name}</a>
                  : {this.state.setSearch.set_num} ----- Year: {this.state.setSearch.year} ----- Total parts: {this.state.setSearch.num_parts}</li>
            </ul>} 
            {this.state.searchedYet ? <></> : <p>Enter a set number to start.</p>}
            {Object.keys(this.state.setSearch).length === 0 && this.state.searchedYet && !this.state.addedSet ? <p>No results...</p> : <></>} 
            {this.state.addedSet ? <p>Set successfully added to setlist!</p> : <></>}
        </>  
    );
  }
}

export default AddSet;
