import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider, Theme } from 'react-native-paper';
import AppNav from './AppNav';
import { store } from './redux/store';

const theme: Theme = {
  ...DefaultTheme,
  roundness: 12,
  colors: {
    ...DefaultTheme.colors,
    primary: '#3498db',
    accent: '#f1c40f',
    text: '#000000'
  }
};

function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={theme}>
        <AppNav />
      </PaperProvider>
    </ReduxProvider>
  );
}

export default App;
