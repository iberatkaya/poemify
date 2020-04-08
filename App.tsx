import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import { DefaultTheme, Provider as PaperProvider, Theme } from 'react-native-paper';
import AppNav from './AppNav';
import { store } from './redux/store';
import { StatusBar } from 'react-native';

const theme: Theme = {
    ...DefaultTheme,
    roundness: 12,
    colors: {
        ...DefaultTheme.colors,
        primary: '#6F7F88',
        accent: '#6F7F88',
        text: '#000000',
        surface: '#f9f9f9',
        background: '#fcfcfc',
    },
};

function App() {
    return (
        <ReduxProvider store={store}>
            <PaperProvider theme={theme}>
                  <StatusBar backgroundColor="#6F7F88" barStyle="default" />
                <AppNav />
            </PaperProvider>
        </ReduxProvider>
    );
}

export default App;
