# Fund Me but with CONTROL -

With this I am trying to take a shot at kickstarter.
I am trying to eliminate how kickstarter might get scammed.

The simplistic approach is to let the manager of the campaign
raise request for releasing funds for all the major expences.


## Issues -

* [ganache hits gas limit](https://ethereum.stackexchange.com/questions/46957/solidity-exceeds-block-gas-limit-during-mocha-tests-with-ganache-cli)

```javascript
const ganache = require('ganache-cli');
const Web3 = require('web3');

const options = { gasLimit: 8000000 };
const provider = ganache.provider(options);
// quote from doc "Both .provider() and .server() take a single object
// which allows you to specify behavior of ganache-cli"
// https://github.com/trufflesuite/ganache-cli#using-ganache-cli
const web3 = new Web3(provider);
```