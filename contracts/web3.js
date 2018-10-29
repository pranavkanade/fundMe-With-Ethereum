const Web3 = require('web3');
// we some how need a provider
// commenting with coz server side rendering.
// hence can't use this directly
// const web3 = new Web3(window.web3.currentProvider);

// use conditional to check where the code is running
let web3;
// check if we are on browser and have access to web3
if (typeof window != 'undefined' && typeof window.web3 != 'undefined') {
    // we r in browser and metamask is running
    web3 = new Web3(window.web3.currentProvider);
} else {
    // We are on the server *OR* the user is not running metamask
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/ca713bd1eafa48d9a37c3d4ab32262c7'
    );
    web3 = new Web3(provider);
}
export default web3;
