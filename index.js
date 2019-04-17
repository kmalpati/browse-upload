var express = require('express');
var multer  = require('multer');
var fs  = require('fs');
var serveIndex = require('serve-index')
var percentage = 0

var app = express();

app.get('/', (req, res) => {
  res.redirect("/content");
});

app.get('/upload', (req, res) => {
    res.sendFile(__dirname + '/upload.html');
});

app.use('/content', express.static('./content'), serveIndex('./content', {'icons': true}))

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        var dir = './content';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir);
        }
        callback(null, dir);
    },
    filename: function (req, file, callback) {
        callback(null, file.originalname);
    }
});
var upload = multer({storage: storage}).array('files', 12);

app.get('/checkstatus', (req, res) => {
    res.end(percentage.toString());
    return;
});

app.post('/fileupload', function (req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            return res.end("Something went wrong:(");
        }
        res.redirect("/content");
    });

    var total = req.headers['content-length'];
    var progress = 0;
    req.on('data', function (chunk) {
        progress += chunk.length;
        var perc = parseInt((progress / total) * 100);
        //console.log('percent complete: ' + perc + '%\n');
        percentage = perc;
    });

})

app.listen(4000);

