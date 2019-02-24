import React, { Component } from 'react';
import * as bs from 'react-bootstrap';

import FAIcon from './FAIcon.js';

import logo from '../resources/wordmark-path.svg';

export default class Navbar extends Component {
  render() {
    return (
      <bs.Navbar bg="light" expand="lg" fixed="top">
        <bs.Container>
          <bs.Navbar.Brand href="/" className="notochord-logo-link">
            <img src={logo} alt="Notochord logo" height="40"/>
          </bs.Navbar.Brand>
          <bs.Navbar.Toggle aria-controls="basic-navbar-nav" />
          <bs.Navbar.Collapse id="basic-navbar-nav">
            <bs.Nav className="mr-auto">
              <bs.Nav.Link href="/about">About</bs.Nav.Link>
            </bs.Nav>
            <bs.Nav>
              <bs.Nav.Link href="/library">
                <FAIcon fastyle="fas" icon="list-ul" />&nbsp;
                My Library
              </bs.Nav.Link>
              <bs.Nav.Link href="/editor">
                <FAIcon fastyle="fas" icon="plus-circle" />&nbsp;
                New Song
              </bs.Nav.Link>
            </bs.Nav>
          </bs.Navbar.Collapse>
        </bs.Container>
      </bs.Navbar>
    );
  }
}