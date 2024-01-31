import React from 'react';
import axios from 'axios';


class SetList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
        setList: []
    }
  }

  componentDidMount() {
    axios.get('http://127.0.0.1:5000/api/user/setlist').then(res => {
      this.setState({
        setList: res.data
      })
    })
  }

  render() {
    return (
        <ul className='pieceList'>
            {this.state.setList.map(set => {
              return <li>{"Name: " + set.set_name + " ----- SetNum: " + set._id + " ----- Total Parts: " + set.num_parts + " ----- Collected Parts: " + set.collected_pieces}</li>
            })}
        </ul>
    );
  }
}

export default SetList;
