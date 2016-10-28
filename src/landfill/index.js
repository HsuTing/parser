'use strict';

import fs from 'fs';
import path from 'path';
import clc from 'cli-color';
import {parse} from 'csv';
import urlencode from 'urlencode';

import getData from './getData';
import writeFile from './../writeFile';

fs.readFile(path.resolve(__dirname, './../../data/landfill/input.csv'), (readError, input) => {
  if(readError)
    throw new Error(readError);

  parse(input, {comment: '#'}, (parseError, output) => {
    if(parseError)
      throw new Error(parseError);

    const tasks = output.slice(1).map((item, index) => {
      const name = item[1];
      if(name === '')
        return;

      let url = `http://erdb.epa.gov.tw/DataRepository/Facilities/LandFillDetail.aspx?`;
      url += `FacilityName=${urlencode(name)}&topic1=${urlencode('地')}&topic2=${urlencode('設施')}&subject=${urlencode('廢棄物處理')}`;
      return getData(name, url);
    });

    Promise.all(tasks.slice(1)).then(data => {
      writeFile('landfill', data);
    }).catch(e => {
      console.log(`${clc.red('Fail!')} ${e}`);
    });
  });
});
