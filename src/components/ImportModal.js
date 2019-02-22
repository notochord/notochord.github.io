import React, {Component} from 'react';
import * as bs from 'react-bootstrap';
import Dropzone from 'react-dropzone';

import '../css/importmodal.css'

import * as songDB from '../songDB.js';

export default class DeleteModal extends Component {
  importFiles(fileData) {
    // @todo: more validation probably
    songDB.putSongs(fileData);
  }
  onDrop(acceptedFiles, rejectedFiles) {
    acceptedFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = () => {
        const fileData = JSON.parse(reader.result);
        this.importFiles(fileData);
      };
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');

      reader.readAsBinaryString(file);
    });

    this.props.handleClose();
  }
  render() {
    return (
      <bs.Modal show={this.props.show} onHide={this.props.handleClose}>
        <bs.Modal.Header closeButton>
          <bs.Modal.Title>Upload one or more songs</bs.Modal.Title>
        </bs.Modal.Header>
        <bs.Modal.Body>
          <Dropzone onDrop={this.onDrop.bind(this)}>
            {({getRootProps, getInputProps, isDragActive}) => 
                <div {...getRootProps()} className={`dropzone ${isDragActive ? 'dropzoneActive' : ''}`}>
                  <input {...getInputProps()} />
                  {
                    isDragActive ?
                      <p>Drop files here...</p> :
                      <p>Try dropping some files here, or click to select files to upload.</p>
                  }
                </div>
              }
          </Dropzone>
        </bs.Modal.Body>
      </bs.Modal>
    );
  }
}