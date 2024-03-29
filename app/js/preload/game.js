// game.js
const color = require('colors');
const { ipcRenderer, remote } = require('electron');
const log = require('electron-logger');
const Store = require('electron-store');
const store = new Store();
// TOAST notifs
document.addEventListener('DOMContentLoaded', () => {

    const style = document.createElement('style');
    style.textContent = `
        /*!
        * Toastify js 1.12.0
        * https://github.com/apvarun/toastify-js
        * @license MIT licensed
        *
        * Copyright (C) 2018 Varun A P
        */
        .toastify {
            padding: 12px 20px;
            color: #fff;
            display: inline-block;
            box-shadow: 0 3px 6px -1px rgba(0, 0, 0, 0.12), 0 10px 36px -4px rgba(77, 96, 232, 0.3);
            background: -webkit-linear-gradient(315deg, #73a5ff, #5477f5);
            background: linear-gradient(135deg, #73a5ff, #5477f5);
            position: fixed;
            opacity: 0;
            transition: all 0.4s cubic-bezier(0.215, 0.61, 0.355, 1);
            border-radius: 2px;
            cursor: pointer;
            text-decoration: none;
            max-width: calc(50% - 20px);
            z-index: 2147483647;
        }
        .toastify.on {
            opacity: 1;
        }
        /* Add more styles as needed */
    `;
    document.head.appendChild(style);
});
