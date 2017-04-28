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

var css = require('./app.css');
var reactLoader = require('qewd-react').loader;

var params = {
  applicationName: 'qewd-transform-json-editor',
  MainPage: require('./MainPage'),
  log: true,
  config: {
    title: 'QEWD JSON Transformer',
    
    loginModal: {
      title: 'Login',
      username: {
        label: 'User Name',
        placeholder: 'Enter User Name'
      }
    },
    
    shutdown: {
      buttonText: 'Restart'
    },
    navs: [
      {
        text: 'Main',
        eventKey: 'main',
        default: true,  // default=true to make this display by default
        panel: {
          title: 'Define Your JSON Mapping',
          contentComponent: require('./EditorPanel')
        }
      } 
    ],
    mode: 'local',
    hl7: 'true'
  }
};

reactLoader(params);
