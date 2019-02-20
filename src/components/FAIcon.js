import React, {Component} from 'react';

// because react-bootstrap doesn't seem to have a component for this lol
export default class FAIcon extends Component {
  render() {
    return (
      <i aria-hidden="true" className={`far fa-${this.props.icon}`}></i>
    );
  }
}