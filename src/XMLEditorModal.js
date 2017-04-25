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
require('codemirror/mode/xml/xml');
var parseXML = require('xml2js').parseString;

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

    this.modalTitle = 'Enter/Edit your Input XML';
    this.showSelect = true;
    this.showModal = this.props.show;
    this.code = '';
    this.fnName = '';
    this.controller = this.props.controller;

    var self = this;

    this.cancel = function() {
      self.showModal = false;
      self.setState({status: 'cancelled'});
    };

    this.controller.on('editorRef', function(ref) {
      self.editor = ref;
    });

    this.updateCode = function(newCode) {
      console.log('updateCode');
      self.code = newCode;
      self.setState({
        status: 'updatedCode'
      });
    };

    this.convertToJSON = function() {
      var xml = self.code.split('\n').join('');
      console.log('convertToJSON: ' + xml);
      var config = {
        trim: true,
        charkey: '_txt',
        //preserveChildrenOrder: false,
        tagNameProcessors: [
          function(input) {
            var name = input.split('.').join('_');
            //if (name === '_') name = 'text';
            return name;
          }
        ]
      };
      parseXML(xml, config, function (err, result) {
        if (!err) {
          console.dir(JSON.stringify(result));
          self.controller.emit('importJSON', result);
        }
        else {
          console.log('** error: ' + err);
          self.controller.toastr('error', 'Invalid XML: ' + err);
        }
      });
    };

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

    console.log('CodeEditorModal rendering');
    //var componentPath = this.controller.updateComponentPath(this);

    var options = {
      lineNumbers: true,
      mode: 'xml'
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
            <Button onClick={this.convertToJSON} bsStyle='success'>Convert to JSON</Button>
            <Button onClick={this.cancel} bsStyle='warning'>Cancel</Button>
          </Modal.Footer>

        </Modal>

    )
  }
});

module.exports = CodeModal;
