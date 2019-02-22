import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

export default class EditableTitle extends Component {
  constructor(props) {
    super(props);
    const song = this.props.song;
    // @todo auto-increment default title?
    this.state = {title: song.title, composer: song.composer};
  }
  titleChanged(e) {
    const newTitle = e.target.value;
    if(newTitle === this.state.title) return; // title didn't change
    this.setState({...this.state, title: newTitle});
    this.props.handleChange(newTitle);
  }
  composerChanged(e) {
    const newComposer = e.target.value;
    if(newComposer === this.state.somposer) return; // title didn't change
    this.setState({...this.state, composer: newComposer});
    this.props.handleChange(null, newComposer);
  }
  render() {
    return (
      <bs.Row className="song-editable-title">
        <bs.Col xs={8}>
          <bs.InputGroup>
            <bs.InputGroup.Prepend>
              <bs.InputGroup.Text>Title</bs.InputGroup.Text>
            </bs.InputGroup.Prepend>
            <bs.Form.Control size="lg" type="text"
              defaultValue={this.state.title}
              onChange={this.titleChanged.bind(this)} />
          </bs.InputGroup>
        </bs.Col>
        <bs.Col>
          <bs.InputGroup>
            <bs.InputGroup.Prepend>
              <bs.InputGroup.Text>Composer</bs.InputGroup.Text>
            </bs.InputGroup.Prepend>
            <bs.Form.Control size="lg" type="text"
              defaultValue={this.state.composer}
              onChange={this.composerChanged.bind(this)} />
          </bs.InputGroup>
        </bs.Col>
      </bs.Row>
    );
  }
}