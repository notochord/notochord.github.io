import React, {Component} from 'react';
import * as bs from 'react-bootstrap';
import { Player, PlaybackStyle } from 'playback';

import FAIcon from './FAIcon.js';

export default class PlaybackControls extends Component {
  player = new Player();
  styleMap = {
    'basic': new PlaybackStyle('basic'),
    'swing': new PlaybackStyle('swing'),
    'samba': new PlaybackStyle('samba'),
  };
  state = {
    playDisabled: true,
  };
  constructor(props) {
    super(props);
    const style = this.styleMap[this.props.song.get('style')];
    this.player.setStyle(style).then(() => this.setState({ playDisabled: false }));
  }
  componentDidMount() {
    this.props.song.onChange('transpose', () => this.setState({}));
    this.props.song.onChange('tempo', () => this.setState({}));
    this.props.song.onChange('style', () => this.setState({}));
  }
  setTranspose(e) {
    const oldTranspose = this.props.song.get('transpose');
    const newTranspose = e.target.value;
    if (newTranspose !== oldTranspose) this.props.song.set('transpose', newTranspose);
  }
  setTempo(e) {
    const oldTempo = this.props.song.get('tempo');
    const newTempo = e.target.value;
    if (newTempo !== oldTempo) this.props.song.set('tempo', newTempo);
  }
  setStyle(e) {
    const oldStyle = this.props.song.get('style');
    const newStyle = e.target.value;
    if (newStyle !== oldStyle) return;
    this.props.song.set('style', newStyle);
    const style = this.styleMap[newStyle];
    this.setState({ playDisabled: true });
    this.player.setStyle(style).then(() => this.setState({ playDisabled: false }));
  }
  render() {
    return (
      <bs.ButtonToolbar className="notochord-toolbar bg-light">
        <bs.Row className="navbar-row">
          <bs.Col>
            <bs.ButtonGroup className="mr-2">
              <bs.Button onClick={this.play} disabled={this.state.playDisabled}>
                <FAIcon icon="play-circle" /> Play
              </bs.Button>
              {/* <bs.Button onClick={window.Notochord.player.stop}>
              <FAIcon icon="stop-circle" /> Stop
              </bs.Button> */}
            </bs.ButtonGroup>
          </bs.Col>
          <bs.Col>
            <bs.Form.Group controlId="Transpose">
              <bs.Form.Label>Transpose</bs.Form.Label>
              <bs.Form.Control as="select" value={this.state.transpose} onChange={this.setTranspose.bind(this)}>
                <option value="0">C</option>
                <option value="1">Db</option>
                <option value="2">D</option>
                <option value="3">Eb</option>
                <option value="4">E</option>
                <option value="5">F</option>
                <option value="6">Gb</option>
                <option value="7">G</option>
                <option value="8">Ab</option>
                <option value="9">A</option>
                <option value="10">Bb</option>
                <option value="11">B</option>
              </bs.Form.Control>
            </bs.Form.Group>
          </bs.Col>
          <bs.Col>
            <bs.Form.Group controlId="Tempo">
              <bs.Form.Label>Tempo</bs.Form.Label>
              <input id="tempo" type="range" min="60" max="220" value={this.state.tempo}
                onChange={this.setTempo.bind(this)}/>
            </bs.Form.Group>
          </bs.Col>
          <bs.Col>
            <bs.Form.Group controlId="Style">
              <bs.Form.Label>Style</bs.Form.Label>
              <bs.Form.Control as="select" value={this.state.style} onChange={this.setStyle.bind(this)}>
              <option key="basic">Basic</option>
              <option key="swing">Swing</option>
              <option key="samba">Samba</option>
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