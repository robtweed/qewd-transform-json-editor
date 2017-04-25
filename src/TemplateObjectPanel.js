/*

 ----------------------------------------------------------------------------
 | qewd-transform-json: Transform JSON using a template                     |
 |                                                                          |
 | Copyright (c) 2016-17 M/Gateway Developments Ltd,                        |
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

  28 March 2017

*/

"use strict"

var React = require('react');
var ReactBootstrap = require('react-bootstrap');
var FormField = require('./FormField');
var CodeEditorModal = require('./CodeEditorModal');

var {
  Button,
  Col,
  Glyphicon,
  Grid,
  Overlay,
  OverlayTrigger,
  Panel,
  Popover,
  Row,
  Tooltip
} = ReactBootstrap;

var jsonEditor = require('qewd-jsoneditor');

var TemplateObjectPanel = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    //this.controller = require('./controller-SessionsPanel')(this.props.controller, this);
    //this.jsonContent = this.props.jsonContent;

    this.controller = this.props.controller;
    this.jsonContent = {};

    var self = this;

    this.showOverlay = false;
    this.showCodeEditor = false;
    this.initialiseEditor = true;

    this.saveTemplate = function() {
      console.log('Save template!');
      var templateObj = self.editor.get();
      console.log('template: ' + JSON.stringify(templateObj, null, 2));
      self.props.controller.send({
        type: 'saveTemplate',
        params: {
          template: templateObj
        }
      });
    };

    this.applyTemplate = function() {
      console.log('apply template!');
      var templateObj = self.editor.get();
      console.log('template: ' + JSON.stringify(templateObj, null, 2));

      self.controller.emit('applyTemplate', templateObj);
    }; 

    this.editFunction = function() {
      console.log('Edit Function');
      self.showCodeEditor = true;
      self.setState({status: 'editCode'});
    };

    if (this.controller.app.mode === 'local') {
      this.templateHeader = (
        <span>
            <b>Template Object</b>
            <Button 
              bsClass="btn btn-success pull-right"
              onClick = {this.applyTemplate}
            >
              Test
            </Button>
        </span>
      );
    }
    else {
      this.templateHeader = (
        <span>
            <b>Template Object</b>
            <Button 
              bsClass="btn btn-primary pull-right"
              onClick = {this.applyTemplate}
            >
              Test Your Template
            </Button>
            <Button 
              bsClass="btn btn-success pull-right"
              onClick = {this.editFunction}
            >
              Function
            </Button>
        </span>
      );
    }

    this.cancelOverlay = function() {
      self.showOverlay = false;
      self.setState({status: 'hideOverlay'});
    };

    this.overlayHeader = (
      <span>
          <b>&nbsp;</b>
          <Button 
            bsClass="btn btn-primary pull-right"
            onClick = {this.cancelOverlay}
          >
            Cancel
          </Button>
      </span>
    );

    this.controller.formFieldHandler.call(this, 'TemplateObjectPanel', 'functionName');



    this.addFunction = function() {
      console.log('function name is ' + self.functionName);

      if (typeof self.functionName === 'undefined' || self.functionName === '') {
        self.controller.displayError('You must define a function name');
        return;
      }

      self.node.updateValue('=> ' + self.functionName + '(' + self.path + ')');

      self.cancelOverlay();
    };

  },

  componentDidMount: function() {

    var container = document.getElementById('templateEditor');
    var self = this;
    var options = {
      name: 'templateEditor',
      modes: ['tree', 'text'],
      mode: 'text',
      onChange: function(eventType, node, path) {
        console.log('*** change!');

        if (!eventType) {
          try {
            self.jsonContent = self.editor.get();
            console.log('this.jsonContent: ' + JSON.stringify(self.jsonContent));
          }
          catch(err) {
            console.log('Probably invalid content in the editor');
          }
        }
        else {
          if (eventType === 'addFunction') {
            console.log('** test - editor root = ' + node.editor.getName());
            self.showOverlay = true;
            self.node = node;
            self.path = path;
            self.setState({status: 'showOverlay'});
          }
        }

      }
    };
    this.editor = new jsonEditor(container, options, this.jsonContent);
  },
  
  componentWillReceiveProps: function(newProps) {
    //this.onNewProps(newProps);
  },

  render: function() {

    return (
      <Panel 
        header = {this.templateHeader}
        bsStyle = "success"
      >

        <CodeEditorModal
          show = {this.showCodeEditor}
          initialise = {this.initialiseEditor}
          controller = {this.controller}
        />

        <Overlay
          show={this.showOverlay}
          placement="bottom"
          container={this}
          containerPadding={20}
        >
          <Popover 
            id = "popover-contained"
            title = {this.overlayHeader}
          >
            <FormField
              placeholder='Function Name'
              fieldname='functionName'
              label='Function Name'
              type='text+button'
              controller = {this.controller}
              formModule = 'TemplateObjectPanel'
              btnHandler = {this.addFunction}
              btnStyle = 'success'
              btnText = 'Add'
            />
          </Popover>
        </Overlay>

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div 
            id = "templateEditor" 
            style = {{width: 500 + 'px', height: 420 + 'px'}}
          >
          </div>
        </div>
      </Panel>
    );
  }
});

module.exports = TemplateObjectPanel;
