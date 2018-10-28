const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

const compiledFactoryCampaign = require('../contracts/build/FactoryCampaign.json');


const provider = new HDWalletProvider(
    'spot stove spare train spawn lecture burden season amount peace board pause',
    'https://rinkeby.infura.io/v3/ca713bd1eafa48d9a37c3d4ab32262c7'
);

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Trying to deploy from account :', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(compiledFactoryCampaign.interface))
    .deploy({ data: compiledFactoryCampaign.bytecode })
    .send({ gas: '2000000', from: accounts[0] });

  console.log('Contract deployed at :', result.options.address);
};
deploy();