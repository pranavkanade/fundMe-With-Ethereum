# Fund Me but with CONTROL -

With this I am trying to take a shot at kickstarter.
I am trying to eliminate how kickstarter might get scammed.

The simplistic approach is to let the manager of the campaign
raise request for releasing funds for all the major expences.

## TODOs -

- [ ] Find if spending request has got rejected.
- [ ] Build a logic to restrict any descision making before some threshold is reached. e.g. rejection/approval of spending request before 75% of donors vote.

## Issues one might enounter-

- [ganache hits gas limit](https://ethereum.stackexchange.com/questions/46957/solidity-exceeds-block-gas-limit-during-mocha-tests-with-ganache-cli)

```javascript
const ganache = require("ganache-cli");
const Web3 = require("web3");

const options = { gasLimit: 8000000 };
const provider = ganache.provider(options);
// quote from doc "Both .provider() and .server() take a single object
// which allows you to specify behavior of ganache-cli"
// https://github.com/trufflesuite/ganache-cli#using-ganache-cli
const web3 = new Web3(provider);
```

## Testing

1. Campaign starter is marked as manager.
2. Allows donation
3. Sets the donor in `cDonors` in contract.
   In this case we may need to access the `cDonors` mapping. This can be done using the function `cDonors` which takes `address` as input and returns `bool` which states if that `address` is donor or not.
4. Requires min contribution. #138

## Address of the factory contract -

`0x524E0151DFbbf32a446BF55e2A13b9918C7dB6e9`
`0xF593FD378d007300F31b45C1C94D462e52Cf9136` - working
