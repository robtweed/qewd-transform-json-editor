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

  9 February 2017

*/

"use strict"

var React = require('react');
var ReactBootstrap = require('react-bootstrap');

var {
  Panel,
  Grid,
  Row,
  Col
} = ReactBootstrap;


var Pane = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {

    this.controller = require('./controller-Panel')(this.props.controller, this);
    this.title = (
      <h1>{this.titleText}</h1>
    );

    if (this.props.content) {
      //console.log('this.props.content exists');
      this.content = React.createElement(this.props.content, {controller: this.controller});
    }
    else {
      //console.log('this.props.content doesnt exist');
      this.content = (<div>No content defined</div>);
    }

  },

  componentWillUpdate: function() {
  },

  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },

  render: function() {

    //var componentPath = this.controller.updateComponentPath(this);

    var props = {
      controller: this.controller
    };

    return (
      <Panel
        collapsible
        expanded={this.expanded}
        header={this.title}
        bsStyle={this.props.bsStyle}
      >
        <Grid
          fluid = {true}
        >
          <Row>
            {this.content}
          </Row>
        </Grid>
      </Panel>
    );
  }
});

module.exports = Pane;
