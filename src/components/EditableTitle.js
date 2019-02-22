import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

export default class EditableTitle extends Component {
  constructor(props) {
    super(props);
    const song = this.props.song;
    // @todo auto-increment default title?
    this.state = {title: song.title};
  }
  titleChanged(e) {
    const newTitle = e.target.value;
    if(newTitle === this.state.title) return; // title didn't change
    this.setState({...this.state, title: newTitle});
    this.props.handleChange(newTitle);
  }
  render() {
    return (
      <bs.Form.Control size="lg" type="text" className="song-editable-title"
        defaultValue={this.state.title}
        onBlur={this.titleChanged.bind(this)} /> // onChange felt too often (wasn't onchange similar to onblur? Did react break it?)
    );
  }
}