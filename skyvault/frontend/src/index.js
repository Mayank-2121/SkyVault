import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.js";
import { Provider } from 'react-redux';
import store from './redux/store';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(

    <Provider store={store}>
        <App />
        <link
            rel="stylesheet"
            href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"
        />
    </Provider>
);