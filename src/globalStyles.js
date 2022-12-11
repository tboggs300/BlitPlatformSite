import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: "Poppins", sans-serif;
    position: fixed;
    height: 100%;
    width: 100%;
  }

  #root {
    height: 100%;
    display: grid;
    grid-template-areas:
      "app-header"
      "app-content";
    grid-template-rows: 10% 90%;
  }
`;

export default GlobalStyle;
