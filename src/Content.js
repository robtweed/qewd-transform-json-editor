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
var Container = require('./Container');

var options;

var Content = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-Content')(this.props.controller, this);
  },

  componentWillReceiveProps: function(newProps) {
    this.onNewProps(newProps);
  },



  render: function() {

    //console.log('rendering Content - this.status = ' + this.status);
    //var componentPath = this.controller.updateComponentPath(this);

    if (this.status === 'initial') {
      return (
        <div></div>
      );
    }
    else {

      var containers = [];
      var container;
      var count = 0;
      var hideByDefault;
      var expanded;
      var self = this;
      this.navs.forEach(function(nav) {

        //console.log('Nav: ' + JSON.stringify(nav));

        hideByDefault = !nav.default;
        expanded = true;
        if (nav.panel.initiallyExpanded === false) expanded = false;
        container = (
          <Container
            controller = {self.controller}
            status = {self.status}
            eventKey = {nav.eventKey}
            hideByDefault = {hideByDefault}
            key = {count}
            panelTitle = {nav.panel.title}
            panelInitiallyExpanded = {expanded}
            panelBsStyle = {nav.panel.bsStyle}
            panelContentComponent = {nav.panel.contentComponent}
          />
        );
        containers.push(container);
        count++;
      });

      return (

        <div>
          {containers}
        </div>
      );
    }
  }
});

module.exports = Content;
