import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

export default class DeleteModal extends Component {
  render() {
    return (
      <bs.Modal show={this.props.show} onHide={() => this.props.handleClose(false)}>
        <bs.Modal.Header closeButton>
          <bs.Modal.Title>Are you <em>sure</em> you want to delete that?</bs.Modal.Title>
        </bs.Modal.Header>
        <bs.Modal.Footer>
          <bs.Button variant="secondary" onClick={() => this.props.handleClose(false)}>
            No, I'm suddenly unsure
          </bs.Button>
          <bs.Button variant="danger" onClick={() => this.props.handleClose(true)}>
            Yes I'm extremely sure
          </bs.Button>
        </bs.Modal.Footer>
      </bs.Modal>
    );
  }
}