import {createGlobalStyle} from 'styled-components'

const GlobalStyles = createGlobalStyle`
  body {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 1);
  }
  ::-webkit-scrollbar {
    width: 10px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 2px grey; 
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb {
    background: #ccc; 
    border-radius: 10px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: grey; 
  }
`

export default GlobalStyles
