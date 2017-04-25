# qewd-transform-JSON-editor: Browser-based editor for developing qewd-transform-json Templates
 
Rob Tweed <rtweed@mgateway.com>  
25 January 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

## Background

This is a browser-based editor for creating, developing and testing qewd-transform-json template objects.

For information on qewd-transform-json, see [https://github.com/robtweed/qewd-transform-json](https://github.com/robtweed/qewd-transform-json)


## Installing

       npm install qewd-transform-json-editor


### Standalone version of the editor

This version can be served up from any web server, or as local files.

Note: the standalone version cannot process custom helper functions.  If you want to do this, you'll need to
install and use the QEWD-based (server-side) version which, in turn, requires 
[QEWD](https://github.com/robtweed/qewd) to be installed.

The files for the standalone version can be found in the */standalone_version* folder of this repository

It is started in a browser by loading the index.html page.

	   
### QEWD version of the editor

This version provides the ability to define and run custom helper functions for your transforms.

**WARNING**: **DO NOT** install this version on a public-facing server, as users can use it to define and run
arbitrary server-side JavaScript functions!  This editor is ONLY to be used and accessible by trusted users on
a non-critical server.  **USE THIS AT YOUR OWN RISK!**

In order to use this version you must have first installed and configured
 [QEWD](https://github.com/robtweed/qewd) to run on your server.

Copy the /qewd_version/www directory to your QEWD /www directory


Start it by loading the index.html page into a browser.  You'll be asked to login in.  Use
any user name, and for the password, enter the QEWD management password.



## License

 Copyright (c) 2017 M/Gateway Developments Ltd,                           
 Redhill, Surrey UK.                                                      
 All rights reserved.                                                     
                                                                           
  http://www.mgateway.com                                                  
  Email: rtweed@mgateway.com                                               
                                                                           
                                                                           
  Licensed under the Apache License, Version 2.0 (the "License");          
  you may not use this file except in compliance with the License.         
  You may obtain a copy of the License at                                  
                                                                           
      http://www.apache.org/licenses/LICENSE-2.0                           
                                                                           
  Unless required by applicable law or agreed to in writing, software      
  distributed under the License is distributed on an "AS IS" BASIS,        
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
  See the License for the specific language governing permissions and      
   limitations under the License.      
