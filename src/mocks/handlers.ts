import { HttpResponse, http } from 'msw';

import { FILE_SRC } from './constants';

const handlers = [
  http.head(FILE_SRC['30'], () => {
    return new HttpResponse(null, {
      headers: { 'Content-Length': `${30 * 1024 * 1024}` },
    });
  }),
  http.get(FILE_SRC['30'], () => {
    return new HttpResponse(new Blob());
  }),
  http.head(FILE_SRC['75'], () => {
    return new HttpResponse(null, {
      headers: { 'Content-Length': `${75 * 1024 * 1024}` },
    });
  }),
  http.get(FILE_SRC['75'], () => {
    return new HttpResponse(new Blob());
  }),
  http.head(FILE_SRC['100'], () => {
    return new HttpResponse(null, {
      headers: { 'Content-Length': `${100 * 1024 * 1024}` },
    });
  }),
  http.get(FILE_SRC['100'], () => {
    return new HttpResponse(new Blob());
  }),
];

export default handlers;
