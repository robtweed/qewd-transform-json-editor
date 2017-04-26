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
var ReactToastr = require('react-toastr');
var jQuery = require('jquery');
window.$ = window.jQuery = jQuery;

var {ToastContainer} = ReactToastr;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

var Banner = require('./Banner');
var Content = require('./Content');
var Shutdown = require('./Shutdown');
var NotLoggedIn = require('./NotLoggedIn');
var LoginModal = require('./LoginModal');

var MainPage = React.createClass({

  getInitialState: function() {
    return {
      status: 'initial'
    }
  },

  componentWillMount: function() {
    this.controller = require('./controller-MainPage')(this.props.controller, this);
  },

  render: function() {

     //console.log('status = ' + this.state.status);

     if (this.state.status === 'shutdown') {
       return (
         <Shutdown
          controller = {this.controller}
         />
       );
     }

     if (this.props.status === 'disconnected') {
       console.log('** disconnected!');
       controller.displayError('Your Session has expired');
       return (
         <NotLoggedIn
           title = {this.title} 
         />
       );
     }

     return (
      <div>
        <Banner
          controller = {this.controller}
        />

        <ToastContainer 
          ref="toastContainer"
          toastMessageFactory={ToastMessageFactory}
          className="toast-top-right"
          newestOnTop={true}
          target="body"
        />

        <LoginModal
          controller = {this.controller}
          show = {this.showLoginModal}
        />

        <Content
          controller = {this.controller}
          status = {this.state.status}
        />

      </div>

    );
  }
});

module.exports = MainPage;
