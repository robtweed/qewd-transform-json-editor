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
var Select = require('react-select');
var CodeMirror = require('react-codemirror');
require('codemirror/mode/javascript/javascript');

var {
  Button
} = ReactBootstrap;

var FormField = require('./FormField');

var ModalContent = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial',
      code: ''
    }
  },

  componentWillMount: function() {
    //this.controller = require('./controller-LoginModal')(this.props.controller, this);

    var self = this;

    this.controller = this.props.controller;
    this.showSelect = this.props.showSelect;
    this.code = this.props.code;

    this.updateCode = function(newCode) {
      //console.log('updateCode');
      self.code = newCode;
      self.setState({
        status: 'updatedCode'
      });
    };

    this.selectedFunction = '';

    this.newFunction = function() {
      var obj = {
        message: {
          name: self.functionName,
          code: 'function(input) {\r\n}'
        }
      };
      self.controller.emit('getFunction', obj);
    };

    this.addFnObject = function() {
      var code;
      var helpers = '{';
      var delim = '';
      for (name in self.controller.helpers) {
        helpers = helpers + delim + name + ': ' + self.controller.helpers[name].toString();
        delim = ',';
      }
      helpers = helpers + '}';
      //console.log('helpers = ' + helpers);
      self.controller.emit('addFunctionObject', helpers);
    };

    this.selectFunction = function(option) {
      //console.log('selectFunction');
      var fnName = option.value
      self.selectedFunction = fnName;

      if (self.controller.app.mode === 'local') {
        var obj = {
          message: {
            name: fnName,
            code: self.controller.helpers[fnName].toString()
          }
        };
        self.controller.emit('getFunction', obj);
      }
      else {
        self.setState({status: 'fnSelected'});
        self.props.controller.send({
          type: 'getFunction',
          params: {
            name: option.value
          }
        });
      }
    };

    this.controller.formFieldHandler.call(this, 'ModalContent', 'functionName');

    this.getFunctions = function() {
      if (this.controller.app.mode === 'local') {
        this.theFunctions = [];
        for (var fnName in this.controller.helpers) {
          this.theFunctions.push({
            value: fnName,
            label: fnName
          });
        }
        this.selectedFunction = '';
        this.setState({status: 'hasFunctions'});
      }
      else {
        this.controller.send({
          type: 'getFunctions'
        }, function(responseObj) {
          self.theFunctions = [];
          responseObj.message.forEach(function(fnName) {
            self.theFunctions.push({
              value: fnName,
              label: fnName
            });
            self.selectedFunction = '';
            self.setState({status: 'hasFunctions'});
          });
        });
      }
    };

    this.getFunctions();

  },

  componentDidMount: function() {
    //this.editor = this.refs.editor.getCodeMirror();
  },

  componentDidUpdate: function() {
    if (this.refs && this.refs.editor) {
      this.editor = this.refs.editor.getCodeMirror();
      this.controller.emit('editorRef', this.editor);
    }
  },

  componentWillReceiveProps: function(newProps) {
    this.showSelect = newProps.showSelect;
    this.code = newProps.code;
    if (this.showSelect) {
      this.getFunctions();
    }
  },

  render: function() {

    //console.log('ModalContent rendering');

    var options = {
      lineNumbers: true,
      mode: 'javascript'
    };

    if (this.showSelect) {
      return (
        <div>

          <Button 
            onClick={this.addFnObject}
            bsStyle='primary'
          >
            Add Helper Function Object
          </Button>

          <h5>Or..</h5>

          <FormField
              placeholder='Function Name'
              fieldname='functionName'
              label='Create a new Function:'
              type='text+button'
              controller = {this.controller}
              formModule = 'ModalContent'
              btnHandler = {this.newFunction}
              btnStyle = 'success'
              btnText = 'Create'
          />

          <h5>Or..</h5>

          <Select
            ref = 'theSelect'
            name="theFunctions"
            value = {this.selectedFunction}
            options={this.theFunctions}
            onChange={this.selectFunction}
          />

        </div>
      )
    }
    else {
      return (
        <CodeMirror
          ref = 'editor'
          value = {this.code}
          onChange={this.updateCode}
          options={options}
        />
      )
    }
  }
});

module.exports = ModalContent;
