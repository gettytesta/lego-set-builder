import React from 'react';
import SetList from './components/setlist';
import SetBuilder from './components/setbuilder';
import IndivSet from './components/indivset';
import AddSet from './components/addset';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageState: 0,
      pageBody: <SetBuilder />,
    }

    this.open_SetBuilder = this.open_SetBuilder.bind(this)
    this.open_SetList = this.open_SetList.bind(this)
    this.open_IndivSet = this.open_IndivSet.bind(this)
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
      pageBody: <SetList openSet={this.open_IndivSet}/>
    })
  }

  open_IndivSet = (set) => {
    this.setState({
      pageState: 2,
      pageBody: <IndivSet set={set}/>
    })
  }

  open_AddSet = () => {
    this.setState({
      pageState: 3,
      pageBody: <AddSet />
    })
  }


  render() {
    return (
      <div className="main">
        <header className="body">
          <td className='header'>
            <div>
              <h1>Lego Set Rebuilder V1.0</h1>            
            </div>
            <button className='menuButton' onClick={this.open_SetBuilder}>Build Sets</button>
            <button className='menuButton' onClick={this.open_SetList}>Check Setlist</button>
            <button className='menuButton' onClick={this.open_AddSet}>Add Sets</button>
          </td>
          {this.state.pageBody}
        </header>
      </div>
    );
  }
}

export default App;
