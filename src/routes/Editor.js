import React, {Component} from 'react';
import * as songDB from '../songDB.js';
import '../css/editor.css';

import { NotochordEditor } from 'notochord-editor';
import Song from 'notochord-song';
import 'notochord-editor/dist/NotochordEditor.css';

import PlaybackControls from '../components/PlaybackControls.js';
import EditableTitle from '../components/EditableTitle.js';

export default class Editor extends Component {
  constructor(props) {
    super(props);
    const uid = props.match.params.uid ? Number(props.match.params.uid) : null;
    if(uid === null) {
      const song = new Song();
      song.set('title', 'New Song')
      this.state = { uid, song };
    } else {
      this.state = { uid, song: null };
    }
  }
  componentDidMount() {
    if (this.state.uid) {
      songDB.getSong(this.state.uid).then(song => {
        song.onChange(this.onSongChange.bind(this));
        this.setState({ song });
      });
    } else {
      this.state.song.onChange(this.onSongChange.bind(this));
    }
  }
  onSongChange() {
    songDB.putSong(this.state.song);
  }
  render() {
    if(!this.state.song) return (<div>Loading...</div>);
    return (
      <>
        <EditableTitle song={this.state.song} />
        <NotochordEditor
          song={this.state.song}
          editable={true}
        />
        <PlaybackControls song={this.state.song}/>
      </>
    );
  }
}