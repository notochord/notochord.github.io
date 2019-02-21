import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

import FAIcon from '../components/FAIcon.js';

import * as songDB from '../songDB.js';

export default class Library extends Component {
  constructor() {
    super();
    this.state = {songs: [], checkedChildren: new Set()};
    this.updateSongState();
    songDB.observe(this.updateSongState.bind(this));
  }
  updateSongState() {
    songDB.getAllSongs().then(songs => {
      this.setState({...this.state, songs})
    });
  }
  childCheckedStateChanged(childUID, checked) {
    let newChecked = new Set([...this.state.checkedChildren]);
    if(checked) {
      newChecked.add(childUID);
    } else {
      newChecked.delete(childUID);
    }
    this.setState({...this.state, checkedChildren: newChecked});
  }
  render() {
    return (
      <div>
        <h2>My library</h2>
        <bs.ListGroup>
          {this.state.songs.map(song => (<LibraryItem key={song.uid} song={song} checkedStateChanged={this.childCheckedStateChanged.bind(this)} />))}
        </bs.ListGroup>
        <LibraryToolbar checkedSongs={this.state.checkedChildren}/>
      </div>
    );
  }
}

class LibraryItem extends Component {
  clicked() {
    window.location = '/editor/';
  }
  render() {
    const song = this.props.song;
    return (
      <bs.ListGroup.Item action href={`/editor/${song.uid}`}>
        <bs.Form.Check
          label={song.title}
          onClick={e => this.props.checkedStateChanged(song.uid, e.target.checked)}/>
      </bs.ListGroup.Item>
    );
  }
}

class LibraryToolbar extends Component {
  deleteChecked() {
    // @todo do this as 1 transaction probably
    this.props.checkedSongs.forEach(uid => songDB.deleteSong(uid));
  }
  duplicateChecked() {
    // heck yeah async
    this.props.checkedSongs.forEach(async (uid) => {
      let song = await songDB.getSong(uid);
      delete song.uid; // hope that doesn't corrupt the copy in the db lol
      songDB.putSong(song);
    });
  }
  async downloadChecked() {
    const library = await Promise.all([...this.props.checkedSongs].map(uid => songDB.getSong(uid)));
    const serialized = encodeURIComponent(JSON.stringify(library));

    //https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
    var element = document.createElement('a');
    element.setAttribute('href', 'data:application/json;charset=utf-8,' + serialized);
    element.setAttribute('download', 'songs.json');
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }
  render() {
    return (
      <bs.ButtonToolbar className="notochord-toolbar bg-light">
          <bs.Button variant="danger" onClick={this.deleteChecked.bind(this)}>
            <FAIcon icon="play-circle" /> Delete {this.props.checkedSongs.size}
          </bs.Button>
          <bs.Button onClick={this.duplicateChecked.bind(this)}>
            <FAIcon icon="play-circle" /> Duplicate {this.props.checkedSongs.size}
          </bs.Button>
          <bs.Button onClick={this.downloadChecked.bind(this)}>
            <FAIcon icon="play-circle" /> Download {this.props.checkedSongs.size}
          </bs.Button>
      </bs.ButtonToolbar>
    );
  }
}