import React from 'react';
import SetList from './components/setlist';
import SetBuilder from './components/setbuilder';


class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pieces: []
    }
  }


  render() {
    return (
      <div className="main">
        <header className="body">
          <h1>Lego Set Builder V1.0</h1>
          <SetBuilder />
        </header>
      </div>
    );
  }
}

export default App;
