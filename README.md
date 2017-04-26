# qewd-transform-JSON-editor: Browser-based editor for developing qewd-transform-json Templates
 
Rob Tweed <rtweed@mgateway.com>  
25 January 2017, M/Gateway Developments Ltd [http://www.mgateway.com](http://www.mgateway.com)  

Twitter: @rtweed

Google Group for discussions, support, advice etc: [http://groups.google.co.uk/group/enterprise-web-developer-community](http://groups.google.co.uk/group/enterprise-web-developer-community)

Special thanks to the Ripple Foundation [http://rippleosi.org  ](http://rippleosi.org) for
support and funding of this project.

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


## Using the Editor

You'll see 3 JSON editor panels:

- The left-hand one is where you paste or input an instance of
an input JSON object - one that you want transformed into another format.  Note that it must be
in JSON format - ie property names and string values must be double-quoted.

- The middle one is where you paste or input your template object.  This will be used by
*qewd-transform-json* as the template for transforming an input object into an output object.

- The right-hand one is where the transformation results will appear.

The JSON editor panels are based on the [jsoneditor module.](https://github.com/josdejong/jsoneditor)

Here's a typical example:

![typical example](https://s3.amazonaws.com/mgateway/qewd/json_editor/overview.png)


Transformations are defined in the template object by "dot syntax" references to paths within the 
input object.  The editor simplifies the process of figuring these paths out and entering them
into the template object by providing you with some additional jsoneditor menu options:

- in the input object editor panel, go into Tree mode and click on the box next to the node you want 
to reference. You'll see a *Get Path* option:


![getpath option](https://s3.amazonaws.com/mgateway/qewd/json_editor/get_path.png)


Click this to copy the path to the editor's clipboard.

- in the template object editor panel, go into Tree mode and click on the box next to the node
against which you want to use the path.  You'll see an *Add Path* option:


![setpath option](https://s3.amazonaws.com/mgateway/qewd/json_editor/set_path.png)


Click this and the path in the editor's clipboard will be pasted in as the JSON node's value.

At any time you can click the *Test Your Template* button.  The editor will apply your template to
your input object, and you'll see the resulting output object appear in the right-hand editor panel.

Once you're happy with the results, copy and paste your template object from the middle panel (select *Text* mode
first) and save it as a file on your computer.

## Defining Transformation Functions

In addition to mapping an input object's properties to a node in an output 
object, the *qewd-transform-json* module allows you to do more complex transformations using
*helper functions*. These are described in the 
[qewd-transform-json README file](https://github.com/robtweed/qewd-transform-json).

You can use the editor to develop and/or test these functions:

First, click the *Function* button in the header banner of the Template Object Editor Panel.  A modal
window will appear with 3 options:

- a button that allows you to paste/edit an object containing all your helper functions in one go
- a form field that allows you to enter a new helper function
- a select widget that allows you to select one of your helper functions to edit

Using any of these will bring up a code entry panel in the modal popup.

If you use the *Add Helper Function Object* button, paste in an object that contains your functions, eg:

        {
          now: function() {
            return new Date().getTime();
          },
          then: function() {
            return 'then';
          },
          getAuthor: function(input) {
            return 'Author is ' + input;
          }
        }

If you use the *Create a new Function* field, an empty function template will appear:

        function (input) {
        }

Fill out the function's logic as required.  Note that your function may have as many inputs as
needed.

If you use the *Select* option, the code for the selected function will appear - edit it as required.

### Using Functions in your Transform Template Object

This is described in detail in the 
[qewd-transform-json README file](https://github.com/robtweed/qewd-transform-json).  If you're using
the editor, you can either manually type in a function reference within your Template object, eg:

       {
         "author": "=> getAuthor(foo.author)"
       }


or you can use the drop-down menus in the editor panels:

First select the path you need from the Input Object

![function get path](https://s3.amazonaws.com/mgateway/qewd/json_editor/function_getPath.png)

Now, in the Template Object editor panel, go into Tree mode, add/select the node you want to use
and bring up the pop-up menu.  You'll see the Add Function option at the bottom of the list:

![addfunction option](https://s3.amazonaws.com/mgateway/qewd/json_editor/add_function.png)

Click the Add Function option and enter the name of the helper function you want to use:

![addfunction name](https://s3.amazonaws.com/mgateway/qewd/json_editor/add_function_name.png)

Clicking the Add button will add the function reference to the Template Object, complete with 
the path from the editor's clipboard:

![addedfunction](https://s3.amazonaws.com/mgateway/qewd/json_editor/function_added.png)


You can now test the helper function-based transformation by clicking the *Test Your Template*
button, and view the results in the Example Output editor panel:

![testfunction](https://s3.amazonaws.com/mgateway/qewd/json_editor/function_test.png)

If, for some reason, the function is unable to be executed, you'll see an error in the
Example Output object:

![testfunction error](https://s3.amazonaws.com/mgateway/qewd/json_editor/function_test_error.png)



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
