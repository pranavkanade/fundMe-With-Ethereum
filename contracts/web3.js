import Web3 from "web3";

const web3 = new Web3(window.web3.currentProvider);
// TODO: Improve for the case where user does not have
// meta mask installed on their browser.
export default web3;
