import React, { Component } from 'react';
import * as bs from 'react-bootstrap';
import * as rrd from 'react-router-dom';

import FAIcon from './FAIcon.jsx';

export default class Navbar extends Component {
  render() {
    return (
      <bs.Navbar bg="light" expand="lg" fixed="top">
        <bs.Container>
          <bs.Navbar.Brand href="/" className="notochord-logo-link">
            <img src="./src/resources/wordmark-path.svg" alt="Notochord logo" height="40"/>
          </bs.Navbar.Brand>
          <bs.Navbar.Toggle aria-controls="basic-navbar-nav" />
          <bs.Navbar.Collapse id="basic-navbar-nav">
            <bs.Nav className="mr-auto">
              <rrd.Link className="nav-link" to="/about">About</rrd.Link>
            </bs.Nav>
            <bs.Nav>
              <rrd.Link className="nav-link" to="/library">
                <FAIcon fastyle="fas" icon="list-ul" />&nbsp;
                My Library
              </rrd.Link>
              <rrd.Link className="nav-link" to="/editor">
                <FAIcon fastyle="fas" icon="plus-circle" />&nbsp;
                New Song
              </rrd.Link>
            </bs.Nav>
          </bs.Navbar.Collapse>
        </bs.Container>
      </bs.Navbar>
    );
  }
}