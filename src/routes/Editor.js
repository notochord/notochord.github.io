import React, {Component} from 'react';
import * as songDB from '../songDB.js';
import * as bs from 'react-bootstrap';
import '../css/editor.css';

import FAIcon from '../components/FAIcon.js';

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
  onTitleChange(newTitle) {
    // I don't wanna deep copy it so this'll have to do
    const song = this.state.song;
    if(!song) return; // @todo how do new songs work?
    song.title = newTitle;
    this.setState({...this.state, song});
    songDB.putSong(song);
  }
  render() {
    const song = this.state.song;
    if(!song) return (<div>Loading...</div>);
    return (
      <>
        <EditableTitle song={song} handleChange={this.onTitleChange.bind(this)} />
        <NotochordRenderer song={song}/>
        <PlaybackControls />
      </>
    );
  }
}

class EditableTitle extends Component {
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

class NotochordRenderer extends Component {
  render() {
    return(<div id="notochordContainer" className="centeredBlock"></div>);
  }
  componentDidMount() {
    // will React freak out and eat the SVG? who knows
    window.Notochord.viewer.appendTo(document.querySelector('#notochordContainer'));

    window.Notochord.viewer.config({
      'width': 800,
      'editable': true,
      'fontSize': 50,
      'shouldResize': false
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
    if(this.props.song.uid) {
      updatedSong.uid = this.props.song.uid;
    }
    songDB.putSong(updatedSong);
  }

  shouldComponentUpdate() {
    return false;
  };

  componentWillUnmount() {
    // destroy 3rd party code here
  };
}

class PlaybackControls extends Component {
  render() {
    return (
      <bs.ButtonToolbar className="notochord-toolbar bg-light">
        <bs.Row className="navbar-row">
          <bs.Col>
            <bs.ButtonGroup className="mr-2">
              <bs.Button onClick={window.Notochord.player.play}>
                <FAIcon icon="play-circle" /> Play
              </bs.Button>
              <bs.Button onClick={window.Notochord.player.stop}>
              <FAIcon icon="stop-circle" /> Stop
              </bs.Button>
            </bs.ButtonGroup>
          </bs.Col>
          <bs.Col>
            <bs.Form.Group controlId="Transpose">
              <bs.Form.Label>Transpose</bs.Form.Label>
              <bs.Form.Control as="select" defaultValue="C" onChange={e => window.Notochord.setTranspose(e.target.value)}>
                <option>C</option>
                <option>Db</option>
                <option>D</option>
                <option>Eb</option>
                <option>E</option>
                <option>F</option>
                <option>Gb</option>
                <option>G</option>
                <option>Ab</option>
                <option>A</option>
                <option>Bb</option>
                <option>B</option>
              </bs.Form.Control>
            </bs.Form.Group>
          </bs.Col>
          <bs.Col>
            <bs.Form.Group controlId="Tempo">
              <bs.Form.Label>Tempo</bs.Form.Label>
              <input id="tempo" type="range" min="60" max="220" defaultValue="160"
                onChange={e => window.Notochord.setTempo(e.target.value)}/>
            </bs.Form.Group>
          </bs.Col>
          <bs.Col>
            <bs.Form.Group controlId="Style">
              <bs.Form.Label>Style</bs.Form.Label>
              <bs.Form.Control as="select" defaultValue="samba" onChange={e => window.Notochord.player.setStyle(e.target.value)}>
                {[...window.Notochord.player.styles.keys()].map(style => (<option key={style}>{style}</option>))}
              </bs.Form.Control>
            </bs.Form.Group>
          </bs.Col>
          {/*<bs.Col>
            <bs.Form.Group controlId="ScaleDegrees">
              <bs.Form.Label>Scale Degrees</bs.Form.Label>
              <input id="scaleDegrees" type="checkbox" onChange={e => window.Notochord.viewer.config({scaleDegrees: e.target.checked})}/>
            </bs.Form.Group>
          </bs.Col>*/}
        </bs.Row>
      </bs.ButtonToolbar>
    );
  }
}