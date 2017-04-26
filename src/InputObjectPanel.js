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

var {
  Button,
  Col,
  Glyphicon,
  Grid,
  OverlayTrigger,
  Panel,
  Row,
  Tooltip
} = ReactBootstrap;

var jsonEditor = require('qewd-jsoneditor');
var XMLEditorModal = require('./XMLEditorModal');

var inputObjectPanel = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    //this.controller = require('./controller-SessionsPanel')(this.props.controller, this);
    //this.jsonContent = this.props.jsonContent;

    this.controller = this.props.controller;

    this.dataPath = '';
    this.jsonContent = {};

    var self = this;

    this.controller.on('importJSON', function(json) {
      self.showXMLEditor = false;
      self.editor.set(json);
      self.controller.emit('inputJSON', json); // push to EditorPanel
      self.setState({status: 'importJSON'});
    });

    this.importXML = function() {
      self.showXMLEditor = true;
      self.setState({status: 'editXML'});
    };

    this.initialiseEditor = true;

    this.tooltip = (
      <Tooltip id="tooltip">
        Paste or enter an example of an input JSON object instance into the editor panel
        below. Alternatively, 
        click the <i>Import XML</i> button, enter an XML document instance and 
        have it converted to a corresponding input JSON document
     </Tooltip>
    );

    this.panelHeader = (
      <span>
        <b>&nbsp;&nbsp;Example Input Object</b>
        <Button 
          bsClass="btn btn-info pull-right"
          onClick = {this.importXML}
        >
        Import XML
        </Button>

        <OverlayTrigger placement="bottom" overlay={this.tooltip}>
          <Button 
            bsClass="btn btn-warning pull-left"
          >
            <Glyphicon 
              glyph="question-sign"
            />
          </Button>
        </OverlayTrigger>

      </span>
    );

  },

  componentDidMount: function() {
    var container = document.getElementById('inputJSONEditor');
    var self = this;
    var options = {
      name: 'inputEditor',
      modes: ['tree', 'text'],
      mode: 'text',
      onChange: function() {
        console.log('*** Input Object Change!');
        if (self.dataPath !== container.dataset.path) {
          console.log('input object path has been changed to ' + container.dataset.path);
          self.dataPath = container.dataset.path;
          return;
        }
        self.jsonContent = self.editor.get();
        self.controller.emit('inputJSON', self.jsonContent); // pass up to editorPanel
      }
    };
    this.editor = new jsonEditor(container, options, this.jsonContent);

  },
  
  componentWillReceiveProps: function(newProps) {
    //this.onNewProps(newProps);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

   //console.log('rendering SessionsPanel: ' + JSON.stringify(this.sessionData));

    return (
      <Panel 
        header = {this.panelHeader}
        bsStyle = "success"
      >

        <XMLEditorModal
          show = {this.showXMLEditor}
          initialise = {this.initialiseEditor}
          controller = {this.controller}
        />

        <div style={{display: 'flex', justifyContent: 'center'}}>
          <div 
            id="inputJSONEditor" 
            style = {{width: 500 + 'px', height: 420 + 'px'}}
            data-path = {this.dataPath}
          >
          </div>
        </div>
      </Panel>
    );
  }
});

module.exports = inputObjectPanel;
