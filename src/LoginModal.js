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

var LoginField = require('./LoginField');

var LoginModal = React.createClass({

  componentWillMount: function() {
    this.controller = require('./controller-LoginModal')(this.props.controller, this);
  },

  render: function() {

    //console.log('LoginModal rendering');
    //var componentPath = this.controller.updateComponentPath(this);

    return (

        <Modal
          show={this.props.show}
          backdrop='static'
          bsStyle='primary' 
          animation={true} 
          onKeyPress={this.handleKeyDown}
        >

          <Modal.Header>
            <Modal.Title>{this.modalTitle}</Modal.Title>
          </Modal.Header>

          <Modal.Body>

            <LoginField
              placeholder={this.username.placeholder}
              fieldname='username'
              label={this.username.label}
              type='text'
              controller = {this.controller}
              focus={true}
            />

            <LoginField
              placeholder={this.password.placeholder}
              fieldname='password'
              type='password'
              label={this.password.label} 
              controller = {this.controller}
            />

          </Modal.Body>

          <Modal.Footer>
            <Button onClick={this.handleLogin} bsStyle='primary'>Login</Button>
          </Modal.Footer>

        </Modal>

    )
  }
});

module.exports = LoginModal;
