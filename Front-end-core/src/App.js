import React from 'react';
import './style.css';
import Main from './Main';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "poppins",
    button: {
      // fontWeight: "bold",
      fontFamily: "poppins"
    }
  }
});

function App() {
  return (
    <ThemeProvider theme={theme}><Main/></ThemeProvider>
  );
}

export default App;
