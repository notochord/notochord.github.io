import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

import FAIcon from './FAIcon.js';

export default class PlaybackControls extends Component {
  constructor(props) {
    super(props);
    const song = this.props.song;
    this.state = {
      transpose: song.transpose || 'C',
      tempo: song.tempo || 160,
      style: song.style || 'samba'
    };
  }
  setTranspose(e) {
    const transpose = e.target.value;
    this.setState({...this.state, transpose});
    this.props.handleChange('transpose', transpose);
    window.Notochord.setTranspose(transpose);
  }
  setTempo(e) {
    const tempo = e.target.value;
    this.setState({...this.state, tempo});
    this.props.handleChange('tempo', tempo);
    window.Notochord.setTempo(tempo);
  }
  setStyle(e) {
    // @todo make sure this is getting serialized in notochord?
    // right now if you change one of these and then the chords everything breaks
    const style = e.target.value;
    this.setState({...this.state, style});
    this.props.handleChange('style', style);
    window.Notochord.player.setStyle(style);
  }
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
              <bs.Form.Control as="select" value={this.state.transpose} onChange={this.setTranspose.bind(this)}>
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
              <input id="tempo" type="range" min="60" max="220" value={this.state.tempo}
                onChange={this.setTempo.bind(this)}/>
            </bs.Form.Group>
          </bs.Col>
          <bs.Col>
            <bs.Form.Group controlId="Style">
              <bs.Form.Label>Style</bs.Form.Label>
              <bs.Form.Control as="select" value={this.state.style} onChange={this.setStyle.bind(this)}>
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