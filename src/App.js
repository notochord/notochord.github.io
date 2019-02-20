import React, { Component } from 'react';
import * as bs from 'react-bootstrap';
import * as rrd from 'react-router-dom';

/* Routes */
import About from './routes/About.js';
import Library from './routes/Library.js';
import Editor from './routes/Editor.js';

/* Components */
import Navbar from './components/Navbar.js'

/* CSS */
import './css/bootstrap.min.css';
import './css/fontawesome-free-5.7.2-web/css/all.min.css';
import './App.css';

export default class App extends Component {
  /*constructor(props) {
    super(props);
    this.state = {song: null};
  }
  setSong(song) {
    this.setState({...this.state, song});
  }*/
  render() {
    return (
      <div>
        <Navbar />
        <bs.Container id="page">
          < NotochordRouter/>
        </bs.Container>
      </div>
    );
  }
}

class NotochordRouter extends Component {
  render() {
    return (
      <rrd.BrowserRouter>
        <rrd.Switch>
          <rrd.Route path="/about" component={About} />
          <rrd.Route path="/library" component={Library} />
          <rrd.Route path="/editor/:uid" component={Editor} />
          <rrd.Route path="/editor" component={Editor} />
          <rrd.Redirect from='/' to='/library'/>
        </rrd.Switch>
      </rrd.BrowserRouter>
    );
  }
}