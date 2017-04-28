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
var CodeMirror = require('react-codemirror');
var hl72json = require('qewd-hl72json');

var {
  Button,
  Form,
  Modal,
  ModalTrigger,
  OverlayMixin
} = ReactBootstrap;

var ModalContent = require('./ModalContent');
var FormField = require('./FormField');

var CodeModal = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      code: ''
    }
  },

  componentWillMount: function() {
    //this.controller = require('./controller-LoginModal')(this.props.controller, this);

    this.modalTitle = 'Paste or Enter your Input HL7 Message';
    this.showSelect = true;
    this.showModal = this.props.show;
    this.code = '';
    this.fnName = '';
    this.controller = this.props.controller;
    this.controller.formFieldHandler.call(this, 'HL7EditorModal', 'hl7Version');

    var self = this;

    this.cancel = function() {
      self.showModal = false;
      self.setState({status: 'cancelled'});
    };

    this.controller.on('editorRef', function(ref) {
      self.editor = ref;
    });

    this.updateCode = function(newCode) {
      //console.log('updateCode');
      self.code = newCode;
      self.setState({
        status: 'updatedCode'
      });
    };

    this.convertToJSON = function() {
      var hl7 = self.code.split('\n');
      //console.log('convertToJSON: ' + hl7);
      //console.log('HL7 version: ' + self.hl7Version);
      var version = '2.3';
      if (self.hl7Version !== '') {
        var allowed = ['2.1','2.2','2.3','2.3.1','2.4','2.5','2.5.1','2.6','2.7','2.7.1'];
        if (allowed.includes(self.hl7Version)) version = self.hl7Version;
      }
      //console.log('using version ' + version);
      var json = hl72json(hl7, version);
      self.controller.emit('importJSON', json);
    };

  },

  componentDidMount: function() {
    //this.editor = this.refs.editor.getCodeMirror();
  },

  componentWillReceiveProps: function(newProps) {
    this.showModal = newProps.show;
    if (newProps.initialise === true) {
      //this.code = '';
      this.showSelect = true;
    }
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    var options = {
      lineNumbers: true
    };

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
            <CodeMirror
              ref = 'editor'
              value = {this.code}
              onChange={this.updateCode}
              options={options}
            />

          </Modal.Body>

          <Modal.Footer>
           <Form inline>
            <FormField
                placeholder='2.3'
                fieldname='hl7Version'
                label='HL7 Version:&nbsp;&nbsp;'
                type='text'
                controller = {this.controller}
                formModule = 'HL7EditorModal'
            />
            <Button onClick={this.convertToJSON} bsStyle='success'>Convert to JSON</Button>
            <Button onClick={this.cancel} bsStyle='warning'>Cancel</Button>
           </Form>
          </Modal.Footer>

        </Modal>

    )
  }
});

module.exports = CodeModal;
