import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

export default class EditableTitle extends Component {
  componentDidMount() {
    this.props.song.onChange('title', () => this.setState({}));
    this.props.song.onChange('composer', () => this.setState({}));
  }
  titleChanged(e) {
    const oldTitle = this.props.song.get('title');
    const newTitle = e.target.value;
    if(newTitle !== oldTitle) this.props.song.set('title', newTitle);
  }
  composerChanged(e) {
    const oldComposer = this.props.song.get('composer');
    const newComposer = e.target.value;
    if(newComposer !== oldComposer) this.props.song.set('composer', newComposer);
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
              value={this.props.song.get('title')}
              onChange={this.titleChanged.bind(this)} />
          </bs.InputGroup>
        </bs.Col>
        <bs.Col>
          <bs.InputGroup>
            <bs.InputGroup.Prepend>
              <bs.InputGroup.Text>Composer</bs.InputGroup.Text>
            </bs.InputGroup.Prepend>
            <bs.Form.Control size="lg" type="text"
              value={this.props.song.get('composer')}
              onChange={this.composerChanged.bind(this)} />
          </bs.InputGroup>
        </bs.Col>
      </bs.Row>
    );
  }
}