var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var fs = require('fs');


request('http://substack.net/images/', function (error, response, body) {
  if (!error && response.statusCode == 200) {
    $ = cheerio.load(body);
    var myArray = [];
    $('tr').each(function(item, value) {
        var filePerm = ($('td:nth-child(1)', value).text()); //File Permission
        var absolute = ($('td:nth-child(3) a', value).attr('href')); //Absolute URL
        var fileType = path.extname($('td:nth-child(3)', value).text()); //File Type
        myArray.push([filePerm, absolute, fileType]);
      });
    var hash = JSON.stringify(myArray);
    var csv = ConvertToCSV(hash); 
    fs.writeFile("./images.csv", csv, function(err) {
      if(err) {
        return console.log(err);
      }
      console.log("The file was saved!");
    }); 
  };
});


function ConvertToCSV(objArray) {
  var array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
  var str = '';

  for (var i = 0; i < array.length; i++) {
    var line = '';
    for (var index in array[i]) {
      if (line != '') line += ','

        line += array[i][index];
    }

    str += line + '\r\n';
  }

  return str;
}

      // myArray.forEach(function(item, index) {
      //   var dataString = item.join(",");
      //   csvFile += dataString + "\n"; 
      // }    
