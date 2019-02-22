import React, {Component} from 'react';
import * as bs from 'react-bootstrap';

import FAIcon from './FAIcon.js';

export default class PlaybackControls extends Component {
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