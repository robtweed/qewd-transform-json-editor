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
var InputObjectPanel = require('./InputObjectPanel');
var TemplateObjectPanel = require('./TemplateObjectPanel');
//var transform = require('qewd-transform-json').transform;
var transform;

var EditorPanel = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    //this.controller = require('./controller-SessionsPanel')(this.props.controller, this);

    this.controller = this.props.controller;

    var self = this;

    if (this.controller.app.mode === 'local') transform = require('qewd-transform-json').transform;

    this.inputJSON = {};
    this.controller.helpers = {};

    this.controller.on('inputJSON', function(json) {
      self.inputJSON = json;
      //console.log('inputJSON updated');
    });

    this.controller.on('applyTemplate', function(templateObj) {
      //console.log('** on applyTemplate');

      if (self.controller.app.mode === 'local') {
        // clone the helpers so the object in controller doesn't get augmented by transform()
        var helpers = {};
        for (var name in self.controller.helpers) {
          helpers[name] = self.controller.helpers[name];
        }
        self.resultEditor.set(transform(templateObj, self.inputJSON, helpers));
      }
      else {
        self.controller.send({
          type: 'testTemplate',
          params: {
            template: templateObj,
            data: self.inputJSON
          }
        }, function(responseObj) {
          self.resultEditor.set(responseObj.message);
        });
      }
    });
  },

  componentDidMount: function() {

    var container = document.getElementById('resultEditor');
    var options = {
      name: 'resultEditor',
      modes: ['text'],
      mode: 'text'
    };
    this.resultEditor = new jsonEditor(container, options);

  },
  
  componentWillReceiveProps: function(newProps) {
    //this.onNewProps(newProps);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

   //console.log('rendering SessionsPanel: ' + JSON.stringify(this.sessionData));

    return (
      <span>
              <Col md={4}>
                <InputObjectPanel
                  controller = {this.controller} 
                />
              </Col>
              <Col md={4}>
                <TemplateObjectPanel
                  controller = {this.controller} 
                />
              </Col>
              <Col md={4}>
                <Panel 
                  header = 'Example Output'
                  bsStyle = "success"
                >
                  <div style={{display: 'flex', justifyContent: 'center'}}>
                    <div 
                      id="resultEditor" 
                      style = {{width: 500 + 'px', height: 420 + 'px'}}
                    >
                    </div>
                  </div>
                </Panel>
              </Col>
      </span>
    );
  }
});

module.exports = EditorPanel;
