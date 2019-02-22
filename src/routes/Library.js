import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

import FAIcon from '../components/FAIcon.js';
import DeleteModal from '../components/DeleteModal.js';
import ImportModal from '../components/ImportModal.js';

import '../css/library.css'

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
      let allUIDs = songs.map(song => song.uid);
      let newChecked = new Set([...this.state.checkedChildren].filter(uid => allUIDs.includes(uid)));
      this.setState({...this.state, checkedChildren: newChecked, songs})
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
  toggleAllChecks() {
    if(this.state.checkedChildren.size) {
      this.setState({...this.state, checkedChildren: new Set()});
    } else {
      let allUIDs = new Set(this.state.songs.map(song => song.uid));
      this.setState({...this.state, checkedChildren: allUIDs});
    }
  }
  render() {
    return (
      <>
        <h2>My library</h2>
        <bs.ListGroup activeKey={null} onSelect={() => 0}>
          <bs.ListGroup.Item variant="secondary" className="checkAll">
            <bs.Form.Check
              label={`${this.state.checkedChildren.size} selected`}
              checked={this.state.checkedChildren.size}
              onChange={this.toggleAllChecks.bind(this)}/>
          </bs.ListGroup.Item>
          {this.state.songs.map(song => (<LibraryItem key={song.uid} song={song} isChecked={this.state.checkedChildren.has(song.uid)} checkedStateChanged={this.childCheckedStateChanged.bind(this)} />))}
        </bs.ListGroup>
        <LibraryToolbar checkedSongs={this.state.checkedChildren}/>
      </>
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
          checked={this.props.isChecked}
          onChange={e => this.props.checkedStateChanged(song.uid, e.target.checked)}/>
      </bs.ListGroup.Item>
    );
  }
}

class LibraryToolbar extends Component {
  constructor() {
    super();
    this.state = {showDeleteModal: false, showImportModal: false};
  }
  showDeleteModal() {
    this.setState({...this.state, showDeleteModal: true});
  }
  handleDeleteModalClose(confirmed) {
    this.setState({...this.state, showDeleteModal: false});
    if(confirmed) {
      // @todo do this as 1 transaction probably
      songDB.deleteSongs(this.props.checkedSongs);
    }
  }
  showImportModal() {
    this.setState({...this.state, showImportModal: true});
  }
  handleImportModalClose(confirmed) {
    this.setState({...this.state, showImportModal: false});
    if(confirmed) {
      console.log(44);
    }
  }
  duplicateChecked() {
    // heck yeah async
    Promise.all(
      [...this.props.checkedSongs].map(async (uid) => {
        let song = await songDB.getSong(uid);
        delete song.uid; // hope that doesn't corrupt the copy in the db lol
        return song;
      })
    ).then(songs => songDB.putSongs(songs));
  }
  async downloadChecked() {
    const library = await Promise.all([...this.props.checkedSongs].map(uid => songDB.getSong(uid)));
    library.forEach(song => delete song.uid);
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
    const anyChecked = !this.props.checkedSongs.size;
    return (
      <>
        <bs.ButtonToolbar className="notochord-toolbar bg-light">
            <bs.Button variant="danger"
              onClick={this.showDeleteModal.bind(this)}
              disabled={anyChecked}>
              <FAIcon icon="trash-alt" /> Delete
            </bs.Button>
            <bs.Button onClick={this.duplicateChecked.bind(this)}
              disabled={anyChecked}>
              <FAIcon icon="copy" /> Duplicate
            </bs.Button>
            <bs.Button onClick={this.downloadChecked.bind(this)}
              disabled={anyChecked}>
              <FAIcon fastyle="fas" icon="file-download" /> Export
            </bs.Button>
            <bs.Button onClick={this.showImportModal.bind(this)}>
              <FAIcon fastyle="fas" icon="file-upload" /> Import
            </bs.Button>
        </bs.ButtonToolbar>
        <DeleteModal show={this.state.showDeleteModal} handleClose={this.handleDeleteModalClose.bind(this)} />
        <ImportModal show={this.state.showImportModal} handleClose={this.handleImportModalClose.bind(this)} />
      </>
    );
  }
}