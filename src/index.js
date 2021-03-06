import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {IntlProvider} from "react-intl";
import {Messages} from "./Messages";

const language = navigator.language.split(/[-_]/)[0];
let messages = Messages[language];
if (!messages) {
  messages = Messages['pt'];
}

ReactDOM.render(
  <IntlProvider locale={language} messages={Messages["pt"]}>
    <App/>
  </IntlProvider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
