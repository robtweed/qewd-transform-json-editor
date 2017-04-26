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

module.exports = function (controller, component) {

  controller.log = true;

  controller.formFieldHandler = function(formModuleName, fieldName) {
    var self = this;
    this.controller[formModuleName] = {
      onFieldChange: function(inputObj) {
        console.log('FieldChange - ' + inputObj.ref + '; ' + inputObj.value);
        self[inputObj.ref] = inputObj.value;
        self.controller[formModuleName][fieldName] = inputObj.value;
      }
    };
    this.controller[formModuleName][fieldName] = '';
  };

  controller.toastr = function(type, text) {
    if (type && type !== '' && component.refs && component.refs.toastContainer && component.refs.toastContainer[type]) {
      component.refs.toastContainer[type](text);
    }
  };

  controller.displayError = function(error) {
    controller.toastr('error', error);
  };

  // display generic EWD.js errors using toastr:

  controller.on('error', function(messageObj) {
    var error = messageObj.message.error || messageObj.message;
    controller.displayError(error);
  });

  // publish the login response handler in this
  // component to force re-render of main page

  controller.on('login', function(messageObj) {
    if (!messageObj.message.error && messageObj.message.ok) {
      // logged in
      component.showLoginModal = false;
      component.setState({
        status: 'loggedIn'
      });
    }
  });


  controller.on('logout', function() {
    controller.disconnectSocket();
    component.setState({
      status: 'shutdown'
    });
  });

  /*
  controller.on('main', function() {
    component.setState({
      status: 'main'
    });
  });
  */

  component.navs = [
    {
      text: 'Main',
      eventKey: 'main',
      default: true,
      panel: {
        title: 'Main Panel'
      }
    }
  ];

  if (component.props.config && component.props.config.navs) {
    component.navs = component.props.config.navs
  }

  component.navs.forEach(function(nav) {
    controller.on(nav.eventKey, function() {
      component.setState({
        status: nav.eventKey
      });
    });
    if (!nav.text) nav.text = 'Unspecified';
    if (!nav.eventKey) nav.eventKey = 'unspecified';
    if (!nav.panel) nav.panel = {};
    if (!nav.panel.bsStyle) nav.panel.bsStyle = 'primary';
    if (!nav.panel.title) nav.panel.title = nav.text + ' Panel';
  });

  if (component.navs.length === 1) {
    if (!component.navs[0].default) component.navs[0].default = true;
  }

  controller.navOptionSelected = function(eventKey) {
    controller.emit(eventKey);
  };

  controller.app = component.props.config || {};
  if (!controller.app.navs) controller.app.navs = component.navs;
  if (!controller.app.title) controller.app.title = 'Un-named Application';

  if (controller.app.loginModal && controller.app.mode !== 'local') {
    component.showLoginModal = true;
  }
  else {
    component.showLoginModal = false;
    component.setState({
      status: 'loggedIn'
    });
  }


  return controller;
};
