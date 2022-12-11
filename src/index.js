import React from 'react';
import * as ReactDOMClient from 'react-dom/client';

import GlobalStyle from 'globalStyles';
import { App } from 'App';

const MyApp = (
  <>
    <GlobalStyle />
    <App />
  </>
);

const target = document.querySelector('#root');
const root = ReactDOMClient.createRoot(target);
root.render(MyApp);
