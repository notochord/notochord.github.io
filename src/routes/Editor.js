import React, {Component} from 'react';
import * as songDB from '../songDB.js';
import * as bs from 'react-bootstrap';
import '../css/editor.css';

import 'notochord/src/core.js';

const NEW_SONG = Symbol('NEW_SONG');

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
  render() {
    const song = this.state.song;
    if(!song) return (<div>Loading...</div>);
    return (
      <div>
        <h2>{song === NEW_SONG ? 'New Song' : song.title}</h2>
        <NotochordRenderer song={song}/>
        <PlaybackControls />
      </div>
    );
  }
}

class NotochordRenderer extends Component {
  render() {
    if(this.props.song === NEW_SONG) return (<div id="notochordContainer" className="centeredBlock">Work in progress...</div>);
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

    if(this.props.song  === NEW_SONG) {
      // noop
    } else {
      window.Notochord.loadSong(new window.Notochord.Song(this.props.song));
    }
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
      <bs.Navbar bg="light" expand="lg">
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
      </bs.Navbar>
    );
  }
}

// because react-bootstrap doesn't seem to have a component for this lol
class FAIcon extends Component {
  render() {
    return (
      <i aria-hidden="true" className={`far fa-${this.props.icon}`}></i>
    );
  }
}