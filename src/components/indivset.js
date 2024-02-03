import React from 'react';
import axios from 'axios';


class IndivSet extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        pieces: []
    }
  }

  componentDidMount() {
    axios.post('http://127.0.0.1:5000/api/user/set', {'set': this.props.set._id}).then(res => {
      this.setState({
        pieces: res.data
      })
    })
  }

  render() {
    return (
        <>
            <h4>{this.props.set.set_name + ": " + this.props.set._id + " ----- Total Parts: " + 
                this.props.set.num_parts + " ----- Collected Parts: " + this.props.set.collected_pieces}</h4>
            <ul className='pieceList'>
                {this.state.pieces.map(piece => {
                // return <li>{piece.name}: {piece.part_num} ----- {piece.color} ----- Total: {piece.quantity} ----- Collected: {piece.obtained_pieces}</li>
                return <li> 
                    <p className='pieceIndiv'>{piece.name}: {piece.part_num} ----- {piece.color}</p>
                    <p className='pieceIndiv2'>Total: {piece.quantity} ----- Collected: {piece.obtained_pieces}</p>
                </li>
                })}
            </ul>
        </>
    );
  }
}

export default IndivSet;
