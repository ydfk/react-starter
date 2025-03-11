import { createAlova } from 'alova';
import ReactHook from 'alova/react';
import adapterFetch from 'alova/fetch';
import {mockAdapter} from './mock/index';

export const alovaInstance = createAlova({
  baseURL: '/api',
  statesHook: ReactHook,
  requestAdapter: import.meta.env.VITE_USE_MOCK === true ? mockAdapter : adapterFetch(),
  responded: {
    onSuccess: async (response) => {
        if (response.status >= 400) {
          throw new Error(response.statusText);
        }
        const json = await response.json();
        if (json.code !== 200) {
          throw new Error(json.message);
        }

        return json.data;
      },
  }
});