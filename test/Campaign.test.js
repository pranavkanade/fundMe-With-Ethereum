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
    console.log(accounts.length);

    factory = await new web3.eth.Contract(JSON.parse(compiledFactoryCampaign.interface))
        .deploy({ data: compiledFactoryCampaign.bytecode })
        .send({ from: accounts[0], gas: '2000000'}); // had to increase gas limit from 1000000
})

describe('FactoryCampaign', () => {
    it('Gets Deployed', () => {
        assert.ok(factory.options.address);
    });
});