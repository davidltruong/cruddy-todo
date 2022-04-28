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
  data = _.map(data, (text, id) => {
    text = text.slice(0, 5);
    return { id: text, text };
  });
  callback(null, data);
};

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, id + '.txt');
  fs.readFile(filePath, "utf8", (err, fileData) => {
    if (err) {
      callback(err);
    } else {
      callback(null, {id, text: fileData});
    }
  });
};

exports.update = (id, text, callback) => {
  var item = items[id];
  if (!item) {
    callback(new Error(`No item with id: ${id}`));
  } else {
    items[id] = text;
    callback(null, { id, text });
  }
};

exports.delete = (id, callback) => {
  var item = items[id];
  delete items[id];
  if (!item) {
    // report an error if item not found
    callback(new Error(`No item with id: ${id}`));
  } else {
    callback();
  }
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
