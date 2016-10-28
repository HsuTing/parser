'use strict';

import jsdom from 'jsdom';

export default (name, url) => {
  return new Promise((resolve, reject) => {
    jsdom.env({
      url,
      done: (err, window) => {
        if(err) {
          reject(`Get ${name}`);
          return;
        }

        const all = window.document.getElementById('meta');
        if(!all) {
          reject(`Parse ${name}`);
          return;
        }

        const output = {};
        const trs = all.querySelectorAll('tr');

        Array.from(trs).forEach(tr => {
          const items = tr.querySelectorAll('td');

          if(items) {
            let key = '';
            Array.from(items).forEach(item => {
              if(!item.querySelector('div')) {
                if(item.querySelector('span'))
                  output[key] = item.querySelector('span').innerHTML;
                else
                  key = item.innerHTML;
              }
            });
          }
        });

        resolve(output);
      }
    });
  });
};
