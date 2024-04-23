import React, { Component } from 'react';
import * as bs from 'react-bootstrap';
import * as rrd from 'react-router-dom';

/* Routes */
import About from './routes/About.jsx';
import Library from './routes/Library.jsx';
import Editor from './routes/Editor.jsx';

/* Components */
import Navbar from './components/Navbar.jsx'

/* CSS */
import './css/bootstrap.min.css';
import './css/fontawesome-free-5.7.2-web/css/all.min.css';
import './App.css';

export default class App extends Component {
  render() {
    return (
      <rrd.HashRouter>
        <>
          <Navbar />
          <bs.Container id="page">
            <rrd.Switch>
              <rrd.Route path="/about" component={About} />
              <rrd.Route path="/library" component={Library} />
              <rrd.Route path="/editor/:uid" component={Editor} />
              <rrd.Route path="/editor" component={Editor} />
              <rrd.Redirect from='/' to='/library'/>
            </rrd.Switch>
          </bs.Container>
        </>
      </rrd.HashRouter>
    );
  }
}