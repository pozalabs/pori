import { afterAll, afterEach, beforeAll } from 'vitest';
import { setupServer } from 'msw/node';
import { Blob } from 'blob-polyfill';

import handlers from './src/mocks/handlers';

const server = setupServer(...handlers);

beforeAll(() => {
  global.Blob = Blob;
  server.listen({ onUnhandledRequest: 'error' });
});
afterAll(() => server.close());
afterEach(() => server.resetHandlers());
