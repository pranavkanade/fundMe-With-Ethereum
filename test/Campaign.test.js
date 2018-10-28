const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

// had to add more listeners from the start this time
require('events').EventEmitter.defaultMaxListeners = 50;

const compiledFactoryCampaign = require('../contracts/build/FactoryCampaign.json');
const compiledCampaign = require('../contracts/build/Campaign.json');

let accounts; // we are getting this from ganache-cli

let factory;
let campaign;
let campaignAddress;

beforeEach(async () => {
    accounts = await web3.eth.getAccounts();
    // console.log(accounts.length);

    factory = await new web3.eth.Contract(JSON.parse(compiledFactoryCampaign.interface))
        .deploy({ data: compiledFactoryCampaign.bytecode })
        .send({ from: accounts[0], gas: '2000000'}); // had to increase gas limit from 1000000

    await factory.methods.startCampaign("test1", '100')
        .send({ from: accounts[0], gas: '2000000' });
    // console.log(campaignAddress);

    [campaignAddress,] = await factory.methods.getDeployedContracts().call();
    // console.log(campaignAddress);

    // get the contract object of already deployed contract using
    // an address of that contract.
    campaign = await new web3.eth.Contract(
        JSON.parse(compiledCampaign.interface),
        campaignAddress
    );
})

describe('FactoryCampaign', () => {
    it('Gets Deployed', () => {
        assert.ok(factory.options.address);
    });
});

describe('Campaign', () => {
    it('Gets Deployed', () => {
        assert.ok(campaign.options.address);
    });
});