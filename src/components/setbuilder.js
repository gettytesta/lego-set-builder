import React from 'react';
import axios from 'axios';


class SetBuilder extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        pieces: []
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:5000/api/piecelist').then(res => {
      this.setState({
        pieces: res.data
      })
    })
  }

  render() {
    return (
        <>
            <input className='legoSearch' placeholder='Enter a piece'></input>
            <ul className='pieceList'>
                {this.state.pieces.map(piece => {
                return <li>{piece.id}</li>
                })}
            </ul>
        </>
    );
  }
}

export default SetBuilder;
