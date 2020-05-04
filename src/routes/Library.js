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
      let allUIDs = songs.map(song => song.get('uid'));
      let newChecked = new Set([...this.state.checkedChildren].filter(uid => allUIDs.includes(uid)));
      this.setState({ checkedChildren: newChecked, songs })
    });
  }
  childCheckedStateChanged(childUID, checked) {
    let newChecked = new Set([...this.state.checkedChildren]);
    if(checked) {
      newChecked.add(childUID);
    } else {
      newChecked.delete(childUID);
    }
    this.setState({ checkedChildren: newChecked });
  }
  toggleAllChecks() {
    if(this.state.checkedChildren.size) {
      this.setState({ checkedChildren: new Set()});
    } else {
      let allUIDs = new Set(this.state.songs.map(song => song.get('uid')));
      this.setState({ checkedChildren: allUIDs});
    }
  }
  render() {
    return (
      <>
        <h2>My library</h2>
        <bs.ListGroup className="songLibrary" activeKey={null} onSelect={() => 0}>
          <bs.ListGroup.Item variant="secondary" className="checkAll">
            <bs.Form.Check
              label={`${this.state.checkedChildren.size} selected`}
              checked={this.state.checkedChildren.size}
              onChange={this.toggleAllChecks.bind(this)}/>
          </bs.ListGroup.Item>
          <div class="songLibraryScroller">
            {this.state.songs.map(song => (<LibraryItem key={song.get('uid')} song={song} isChecked={this.state.checkedChildren.has(song.get('uid'))} checkedStateChanged={this.childCheckedStateChanged.bind(this)} />))}
          </div>
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
      <bs.ListGroup.Item className="songLibraryItem" action href={`/editor/${song.get('uid')}`}>
        <bs.Form.Check
          className="songLibraryCheck"
          label={song.get('title')}
          checked={this.props.isChecked}
          onChange={e => this.props.checkedStateChanged(song.get('uid'), e.target.checked)}/>
        <span className="songLibraryComposer">{song.get('composer')}</span>
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
    this.setState({ showDeleteModal: true});
  }
  handleDeleteModalClose(confirmed) {
    this.setState({ showDeleteModal: false});
    if(confirmed) {
      // @todo do this as 1 transaction probably
      songDB.deleteSongs(this.props.checkedSongs);
    }
  }
  showImportModal() {
    this.setState({ showImportModal: true});
  }
  handleImportModalClose(confirmed) {
    this.setState({ showImportModal: false});
  }
  duplicateChecked() {
    // heck yeah async
    Promise.all(
      [...this.props.checkedSongs].map(async (uid) => {
        const song = await songDB.getSong(uid);
        song.set('uid', undefined);
        return song;
      })
    ).then(songs => songDB.putSongs(songs));
  }
  async downloadChecked() {
    const library = await Promise.all([...this.props.checkedSongs].map(uid => songDB.getSong(uid)));
    library.forEach(song => song.set('uid', undefined));
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