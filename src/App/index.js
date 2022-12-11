import React from 'react';

import { Canvas, Header, ActionBar } from 'components';
import { AppContainer } from './styles';

const App = (props) => {
  return (
    <AppContainer>
      <Header />
      <ActionBar />
      <Canvas />
    </AppContainer>
  );
};
export { App };
