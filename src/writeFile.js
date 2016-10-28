'use strict';

/*
 * Write Files(.json, .csv).
 *
 * @param name {string} - name of output file.
 * @param data {json} - json type data.
 *
 * For example:
 *
 * import writeFile from './writeFile';
 *
 * const data = [
 *   {
 *     key: '1',
 *     item: 'test1'
 *   },
 *   {
 *     key: '2',
 *     item: 'test2'
 *   }
 * ];
 *
 * writeFile(data);
*/

import fs from 'fs';
import path from 'path';
import clc from 'cli-color';
import json2csv from 'json2csv';

const writeJson = (name, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(path.resolve(__dirname, './../data/', name, name + '.json'), JSON.stringify(data), 'utf8', err => {
      if(err)
        reject(`${name}.json`);
      else
        resolve(`${clc.greenBright('Success!')} ${name}.json`);
    });
  });
};

const writeCsv = (name, data) => {
  return new Promise((resolve, reject) => {
    try {
      const fields = Object.keys(data[0]);
      const output = json2csv({data, fields});
      fs.writeFile(path.resolve(__dirname, './../data/', name, name + '.csv'), output, 'utf8', err => {
        if(err)
          reject(`${name}.csv`);
        else
          resolve(`${clc.greenBright('Success!')} ${name}.csv`);
      });
    } catch(e) {
      reject(`${name}.csv (convert fail)`);
    }
  });
};

export default (name, data) => {
  Promise.all([
    writeJson(name, data),
    writeCsv(name, data)
  ]).then(tasks => {
    tasks.forEach(status => {
      console.log(status);
    });
  }).catch(e => {
    console.log(`${clc.red('Fail!')} ${e}`);
  });
};
