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

  component.password = '';
  component.username = '';

  controller.LoginModal = {
    onLoginFieldChange: function(inputObj) {
      //console.log('onFieldChange - ' + inputObj.ref + '; ' + inputObj.value);
      component[inputObj.ref] = inputObj.value;
    }
  };

  component.handleKeyDown = function(e) {
    // enter key pressed
    if (e.charCode === 13) {
      component.handleLogin();
    }
  };

  component.handleLogin = function() {

    if (component.username === '') {
      controller.displayError('You must enter your username');
      return;
    }

    if (component.password === '') {
      controller.displayError('You must enter your password');
      return;
    }

    // send login message
    //   response handler subscription is in parent component (MainPage)

    controller.send({
      type: 'login',
      params: {
        username: component.username,
        password: component.password
      }
    });
  };

  component.modalTitle = 'Login';
  component.username = {
    placeholder: 'Enter your username',
    label: 'Username'
  };
  component.password = {
    placeholder: 'Enter your password',
    label: 'Password'
  };
  if (controller.app.loginModal) {
    if (controller.app.loginModal.title) {
      component.modalTitle = controller.app.loginModal.title;
    }
    if (controller.app.loginModal.username) {
      if (controller.app.loginModal.username.label) {
        component.username.label = controller.app.loginModal.username.label;
      }
      if (controller.app.loginModal.username.placeholder) {
        component.username.placeholder = controller.app.loginModal.username.placeholder;
      }
    }
    if (controller.app.loginModal.password) {
      if (controller.app.loginModal.password.label) {
        component.password.label = controller.app.loginModal.password.label;
      }
      if (controller.app.loginModal.password.placeholder) {
        component.password.placeholder = controller.app.loginModal.password.placeholder;
      }
    }
  }

  return controller;
};
