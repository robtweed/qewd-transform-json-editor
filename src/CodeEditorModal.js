/*

 ----------------------------------------------------------------------------
 | qewd-content-store: Content store using semi-structured free text        |
 |                                                                          |
 | Copyright (c) 2017 M/Gateway Developments Ltd,                           |
 | Redhill, Surrey UK.                                                      |
 | All rights reserved.                                                     |
 |                                                                          |
 | http://www.mgateway.com                                                  |
 | Email: rtweed@mgateway.com                                               |
 |                                                                          |
 |                                                                          |
 | Licensed under the Apache License, Version 2.0 (the "License");          |
 | you may not use this file except in compliance with the License.         |
 | You may obtain a copy of the License at                                  |
 |                                                                          |
 |     http://www.apache.org/licenses/LICENSE-2.0                           |
 |                                                                          |
 | Unless required by applicable law or agreed to in writing, software      |
 | distributed under the License is distributed on an "AS IS" BASIS,        |
 | WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. |
 | See the License for the specific language governing permissions and      |
 |  limitations under the License.                                          |
 ----------------------------------------------------------------------------

  7 February 2017

*/

"use strict"

var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var {
  Button,
  Modal,
  ModalTrigger,
  OverlayMixin
} = ReactBootstrap;

var ModalContent = require('./ModalContent');

var CodeModal = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      code: ''
    }
  },

  componentWillMount: function() {
    //this.controller = require('./controller-LoginModal')(this.props.controller, this);

    this.modalTitle = 'Enter/Edit your JavaScript Function';
    this.showSelect = true;
    this.addFunctionObject = false;
    this.showModal = this.props.show;
    this.code = '';
    this.helperFunctionCode = '';
    this.fnName = '';
    this.controller = this.props.controller;

    var self = this;

    this.cancel = function() {
      self.showModal = false;
      self.setState({status: 'cancelled'});
    };

    this.saveFunction = function() {
      if (self.controller.app.mode === 'local') {
        var code = self.editor.getValue();
        if (self.addFunctionObject) {
          try {
            eval('self.controller.helpers = ' + code);
            self.showModal = false;
            self.setState({status: 'functionSaved'});
          }
          catch(err) {
            self.controller.toastr('error', 'Unable to parse object: ' + err);
          }
        }
        else {
          try {
            eval('self.controller.helpers[self.fnName] = ' + code);
            self.showModal = false;
            self.setState({status: 'functionSaved'});
          }
          catch(err) {
            self.controller.toastr('error', 'Invalid Function: ' + err);
          }
        }
      }
      else {
        self.props.controller.send({
          type: 'saveFunction',
          params: {
            name: self.fnName,
            code: self.editor.getValue()
          }
        }, function(responseObj) {
          if (!responseObj.message.error) {
            self.showModal = false;
            self.setState({status: 'functionSaved'});
          }
        });
      }
    };

    this.deleteFunction = function() {
      if (self.controller.app.mode === 'local') {
        if (self.addFunctionObject) {
          delete self.controller.helpers;
        }
        else {
          delete self.controller.helpers[self.fnName];
        }
        self.showModal = true;
        self.showSelect = true;
        self.code = '';
        self.modalTitle = 'Enter/Edit your JavaScript Function';
        self.setState({status: 'functionDeleted'});
      }
      else {
        self.props.controller.send({
          type: 'deleteFunction',
          params: {
            name: self.fnName
          }
        }, function(responseObj) {
          if (!responseObj.message.error) {
            self.showModal = true;
            self.showSelect = true;
            self.code = '';
            self.modalTitle = 'Enter/Edit your JavaScript Function';
            self.setState({status: 'functionDeleted'});
          }
        });
      }
    };

    this.controller.on('editorRef', function(ref) {
      self.editor = ref;
    });

    this.controller.on('addFunctionObject', function(code) {
      self.showSelect = false;
      self.addFunctionObject = true;
      self.modalTitle = 'Paste/edit Helper Function Object';
      self.code = code;
      self.setState({status: 'addFunctionObject'});
    });

    this.controller.on('getFunction', function(responseObj) {
      if (!responseObj.error) {
        self.showSelect = false;
        self.addFunctionObject = false;
        self.modalTitle = 'Edit function ' + responseObj.message.name;
        self.fnName = responseObj.message.name;
        self.code = responseObj.message.code;
        self.setState({status: 'fetchedFunction'});
      }
    });

  },

  componentDidMount: function() {
    //this.editor = this.refs.editor.getCodeMirror();
  },

  componentWillReceiveProps: function(newProps) {
    this.showModal = newProps.show;
    if (newProps.initialise === true) {
      this.code = '';
      this.showSelect = true;
    }
  },

  render: function() {

    //console.log('CodeEditorModal rendering');
    //var componentPath = this.controller.updateComponentPath(this);

    var display = '';
    if (this.showSelect) display = 'hidden';

    return (

        <Modal
          show={this.showModal}
          backdrop='static'
          bsStyle='primary' 
          animation={true} 
          onKeyPress={this.handleKeyDown}
        >

          <Modal.Header>
            <Modal.Title>{this.modalTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <ModalContent
              controller = {this.controller}
              showSelect = {this.showSelect}
              addFunctionObject = {this.addFunctionObject}
              code = {this.code}
              fnName = {this.fnName}
            />

          </Modal.Body>

          <Modal.Footer>
            <span
              className = {display}
            >
              <Button onClick={this.saveFunction} bsStyle='success'>Save</Button>
              <Button onClick={this.deleteFunction} bsStyle='danger'>Delete</Button>
            </span>
            <Button onClick={this.cancel} bsStyle='warning'>Cancel</Button>

          </Modal.Footer>

        </Modal>

    )
  }
});

module.exports = CodeModal;
