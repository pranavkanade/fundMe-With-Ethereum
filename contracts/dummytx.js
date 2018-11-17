const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");

const compiledFactoryCampaign = require("../contracts/build/FactoryCampaign.json");

const provider = new HDWalletProvider(
  "spot stove spare train spawn lecture burden season amount peace board pause",
  "https://rinkeby.infura.io/v3/ca713bd1eafa48d9a37c3d4ab32262c7"
);

const web3 = new Web3(provider);

const transact = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Trying to deploy from account :", accounts[0]);

  const factory = await new web3.eth.Contract(
    JSON.parse(compiledFactoryCampaign.interface),
    "0xF593FD378d007300F31b45C1C94D462e52Cf9136"
  );

  console.log("Got contract instance at :", factory.options.address);

  console.log("Creating new Campaigns");
  await factory.methods
    .startCampaign("Test Campaign 1", "1000")
    .send({ from: accounts[0], gas: "2000000" });
  await factory.methods
    .startCampaign("Test Campaign 2", "500")
    .send({ from: accounts[0], gas: "2000000" });
  console.log("Done");
};
transact();
