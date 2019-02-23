import React, {Component} from 'react';
import * as songDB from '../songDB.js';
import '../css/editor.css';

import PlaybackControls from '../components/PlaybackControls.js';
import EditableTitle from '../components/EditableTitle.js';

import 'notochord/src/core.js';

const NEW_SONG = {title: 'New Song'};

export default class Editor extends Component {
  constructor(props) {
    super(props);
    const uid = props.match.params.uid ? Number(props.match.params.uid) : null;
    // @todo I don't not expect this to persist when it gets routed away from
    // and back to .... how to deal with that scenario?
    if(uid === null) {
      this.state = {song: NEW_SONG};
    } else {
      this.state = {song: null};
      songDB.getSong(uid).then(song => {
        this.setState({...this.state, song});
      });
    }
  }
  updateSongProp(prop, newValue) {
    // I don't wanna deep copy it so this'll have to do
    const song = this.state.song;
    if(!song) return; // @todo how do new songs work?
    if(song[prop] === newValue) return; // no update needed
    song[prop] = window.Notochord.currentSong[prop] = newValue;

    this.onSongChange(song);
  }
  onSongChange(song) {
    if(!song.uid && this.state.song.uid) song.uid = this.state.song.uid;
    songDB.putSong(song).then(newUid => {
      if(!song.uid) {
        song.uid = window.Notochord.currentSong.uid = newUid;
      }
    });
    this.setState({...this.state, song});
  }
  render() {
    const song = this.state.song;
    if(!song) return (<div>Loading...</div>);
    return (
      <>
        <EditableTitle song={song} handleChange={this.updateSongProp.bind(this)} />
        <NotochordRenderer song={song} handleChange={this.onSongChange.bind(this)} />
        <PlaybackControls song={song} handleChange={this.updateSongProp.bind(this)}/>
      </>
    );
  }
}

class NotochordRenderer extends Component {
  render() {
    return(<div id="notochordContainer"></div>);
  }
  componentDidMount() {
    // will React freak out and eat the SVG? who knows
    window.Notochord.viewer.appendTo(document.querySelector('#notochordContainer'));

    window.Notochord.viewer.config({
      'width': 800,
      'editable': true,
      'fontSize': 50,
      'shouldResize': false,
      'showTitle': false
    });
    window.Notochord.player.config({
      'tempo': 160
    });

    window.Notochord.loadSong(new window.Notochord.Song(this.props.song));

    // subscribe to changes
    window.Notochord.events.on('Editor.commitUpdate', this.songChanged.bind(this));
  }
  songChanged() {
    const updatedSong = window.Notochord.currentSong.serialize();
    this.props.handleChange(updatedSong);
  }

  shouldComponentUpdate() {
    return false;
  };

  componentWillUnmount() {
    // destroy 3rd party code here
  };
}