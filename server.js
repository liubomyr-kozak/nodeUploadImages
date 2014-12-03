// server.js

// set up ========================
var express = require('express');
var app = express();                               // create our app w/ express
var fs = require('fs');                               // create our app w/ express
var request = require('request');
var bodyParser = require('body-parser');

// IMAGE FEATU
var gm = require('gm'),
  imageMagick = gm.subClass({imageMagick: true});

// configuration =================

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(bodyParser.urlencoded({'extended': 'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({type: 'application/vnd.api+json'})); // parse
app.listen(8888);
console.log("App listening on port 8888");

// application -------------------------------------------------------------
app.get('*', function (req, res) {
  res.sendfile('./public/index.html'); // load the single view file (angular will handle the page changes on the front-end)
});

// routes ======================================================================

app.post('/image/', function (req, res) {
  var url = "https://www.npmjs.org/static/img/npm.png";
  handleUrl(url, res);
});

var handleUrl = function (url, res) {

  // Couldn't have done this without the help of bxjx (http://stackoverflow.com/users/373903)
  var onDownloadSuccess = function (error, response, body) {
    if (!error && response.statusCode == 200) {
      handleFile(response, res, body, url);
    }
    else res.send("Third-party server error", response.statusCode);
  };

  request({uri: url, encoding: null}, onDownloadSuccess);
};

var handleFile = function (response, res, body, url) {
  var mimetype = response.headers["content-type"];

  if (isImageFile(mimetype)) {
    handleImage(res, body, url);
  }
  else
    res.send("This file type is not supported", 400);

};

var isImageFile = function (mimetype) {
  return mimetype == "image/gif"
    || mimetype == "image/jpeg"
    || mimetype == "image/jpg"
    || mimetype == "image/png"
    || mimetype == "image/tiff";
};

var handleImage = function (response, body) {

  var image_64 = body.toString('base64');

  var data = JSON.stringify(image_64);

  response.writeHead(200, {'Content-Type': 'application/json; charset=UTF-8'});
  response.end(data);
};


// app.post('/image/', function (req, res) {
//     // Get the parameters

//     var url = unescape(req.body.url);

//       // Couldn't have done this without the help of bxjx (http://stackoverflow.com/users/373903)
//       request({uri: url, encoding: null}, function (error, response, body) {

//       // If the request was OK
//       if (!error && response.statusCode == 200) {

//         // Check if the mimetype says it is an image

//         var mimetype = response.headers["content-type"];

//         if (mimetype == "image/gif" || mimetype == "image/jpeg" ||
//           mimetype == "image/jpg" || mimetype == "image/png" ||
//           mimetype == "image/tiff") {

//           // Create the prefix for the data URL
//           var type_prefix = "data:" + mimetype + ";base64,",

//           // Get the image from the response stream as a string and convert it to base64
//             image_64 = body.toString('base64'),
//             buffer = new Buffer(image_64, 'base64'),

//           // Get the image filename
//             filename = "/tmp/" + url.substring(url.lastIndexOf('/') + 1);


//           // // Save the file
//           fs.writeFile(filename, buffer, function (err) { });

//           console.log(filename)
//           // Get the image dimensions using GraphicsMagick
//           gm(filename)
//             .identify(function (err, data) {
//               if (!err){
//                 data = JSON.stringify(data)
//                 res.writeHead(200, {'Content-Type': 'application/javascript; charset=UTF-8'});
//                 res.end(data);  
//               }
//               });
//           // imageMagick(buffer).identify(function (err, data) {

//           //   // Delete the tmp image
//           //   // fs.unlink(filename);

//           //   // Error getting dimensions
//           //   if (err) res.send("Error getting image dimensions", 400);
//           //   else {

//           //     // width = size.width;
//           //     // height = size.height;

//           //     // console.log(filename)
//           //     // // The data to be returned
//           //     // var return_variable = {
//           //     //   "width": width,
//           //     //   "height": height,
//           //     //   "data": type_prefix + image_64
//           //     // };

//           //     // Stringifiy the return variable and wrap it in the callback for JSONP compatibility
//           //     // return_variable = JSON.stringify(return_variable);

//           //     // Set the headers as OK and JS
//           //     // res.writeHead(200, {'Content-Type': 'application/javascript; charset=UTF-8'});


//           //     // Return the data
//           //     res.end(data);

//           //   }

//           // }
//           // );

//           // File type was not a supported image
//         } else res.send("This file type is not supported", 400);

//         // Error getting the image
//       } else res.send("Third-party server error", response.statusCode);

//     });
// });


