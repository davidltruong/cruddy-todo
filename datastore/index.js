const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  counter.getNextUniqueId((err, number) => {
    fs.writeFile(path.join(exports.dataDir, number + '.txt'), text, (err) => {
      items[number] = {id: number, text: text};
      if (err) {
        throw ('error writing counter');
      } else {
        callback(null, items[number]);
      }
    });
  });
};

exports.readAll = (callback) => {
  var data = fs.readdirSync(exports.dataDir);
  data = _.map(data, (id) => {
    id = id.slice(0, 5);
    var filePath = path.join(exports.dataDir, id + '.txt');
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, text) => {
        if (err) {
          return reject(err);
        }
        resolve({id, text});
      });
    });
  });
  Promise.all(data).then((data) => {
    callback(null, data);
  });
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, 'utf8', (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text: fileData});
    }
  });
};

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          callback(err);
        } else {
          callback(null, text);
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.unlink(filePath, (err) => {
    callback(err);
  });
  // fs.readFile(filePath, (err, fileData) => {
  //   if (err) {
  //     callback('error');
  //   } else {
  //     fs.unlinkSync(filePath);
  //     callback();
  //   }
  // });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
