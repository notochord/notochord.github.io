import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

import * as songDB from '../songDB.js';

export default class Library extends Component {
  constructor() {
    super();
    this.state = {songs: []};
    this.updateSongState();
    songDB.observe(this.updateSongState.bind(this));
  }
  updateSongState() {
    songDB.getAllSongs().then(songs => {
      this.setState({...this.state, songs})
    });
  }
  render() {
    return (
      <div>
        <h2>My library</h2>
        <bs.ListGroup>
          {this.state.songs.map(song => (<LibraryItem key={song.uid} song={song} setSong={this.props.setSong} />))}
        </bs.ListGroup>
      </div>
    );
  }
}

class LibraryItem extends Component {
  clicked() {
    window.location = '/editor/';
  }
  render() {
    return (
      <bs.ListGroup.Item action href={`/editor/${this.props.song.uid}`}>
        {this.props.song.title}
      </bs.ListGroup.Item>
    );
  }
}