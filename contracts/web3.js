import Web3 from "web3";

let web3;
if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
  // this means that we are running on browser
  // and web3 is accessible
  web3 = new Web3(window.web3.currentProvider);
} else {
  // we are rendering on server
  const provider = new Web3.providers.HttpProvider(
    "https://rinkeby.infura.io/v3/ca713bd1eafa48d9a37c3d4ab32262c7"
  );
  web3 = new Web3(provider);
}

export default web3;
