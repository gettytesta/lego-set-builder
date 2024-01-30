import React from 'react';
import axios from 'axios';
import SetList from './components/setlist';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pieces: []
    }
  }

  // componentDidMount() {
  //   axios.get('http://127.0.0.1:5000/api/piecelist').then(res => {
  //     this.setState({
  //       pieces: res.data
  //     })
  //   })
  // }

  render() {
    return (
      <div className="main">
        <header className="body">
          <h1>Lego Set Builder V1.0</h1>
          {/* <input className='legoSearch' placeholder='Enter a piece'></input>
          <ul className='pieceList'>
            {this.state.pieces.map(piece => {
              return <li>{piece.id}</li>
            })}
          </ul> */}
          <SetList />
        </header>
      </div>
    );
  }
}

export default App;
