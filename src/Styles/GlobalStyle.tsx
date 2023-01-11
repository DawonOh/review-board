import { createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';

const GlobalStyles = createGlobalStyle`
${reset}
  a{
    text-decoration:none;
    color:inherit;
  }

  *{
    box-sizing:border-box;
  }

  @media all and (min-width:1024px) {
    body {
      font-size: 16px;
    }
  } 

  @media all and (min-width:768px) and (max-width:1023px) {
    body {
      font-size: 15px;
    }
  } 
  
  @media all and (max-width:767px) {
    body {
      font-size: 14px;
    }
  }
`;

export default GlobalStyles;
