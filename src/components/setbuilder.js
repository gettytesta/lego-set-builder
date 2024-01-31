import React from 'react';
import axios from 'axios';


class SetBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        textValue: "",
    }

    this.textChange = this.textChange.bind(this)
  }


  textChange = (event) => {
    this.setState({
      textValue: event.target.value,
    })
  }

  render() {
    console.log(this.state.pieces)
    return (
        <>
            <input className='legoSearch' placeholder='Enter a piece' onChange={this.textChange}></input>
            <ul className='pieceList'>

            </ul>
        </>
    );
  }
}

export default SetBuilder;
