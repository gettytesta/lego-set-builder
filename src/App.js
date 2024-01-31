import React from 'react';
import SetList from './components/setlist';
import SetBuilder from './components/setbuilder';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageState: 0,
      pageBody: <SetBuilder />,
    }

    this.open_SetBuilder = this.open_SetBuilder.bind(this)
    this.open_SetList = this.open_SetList.bind(this)
  }

  open_SetBuilder = () => {
    this.setState({
      pageState: 0,
      pageBody: <SetBuilder />
    })
  }

  open_SetList = () => {
    this.setState({
      pageState: 1,
      pageBody: <SetList />
    })
  }


  render() {
    return (
      <div className="main">
        <header className="body">
          <td className='header'>
            <h1>Lego Set Builder V1.0</h1>
            <button className='menuButton' onClick={this.open_SetBuilder}>Build a Set</button>
            <button className='menuButton' onClick={this.open_SetList}>Check Setlist</button>
          </td>
          {this.state.pageBody}
        </header>
      </div>
    );
  }
}

export default App;
