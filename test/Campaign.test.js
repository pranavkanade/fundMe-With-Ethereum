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

    it('Can deploy Campaign contract', () => {
        assert.ok(campaign.options.address);
    });
});

describe('Campaign', () => {
    it('Allows donation to campaign', async () => {
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[1],
                gas: '1000000',
                value: '200'
            });
        let balance = await campaign.methods.getBalance().call();
        // console.log(balance);
        assert(balance == 200);
    });

    it('Lets manager raise spending request', async () => {
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[1],
                gas: '1000000',
                value: '200'
            });
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[2],
                gas: '1000000',
                value: '200'
            });
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[3],
                gas: '1000000',
                value: '200'
            });
        // raise a spending request
        await campaign.methods.raiseSpendingRequest(
            "Spending request test - 1",
            '300'
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        await campaign.methods.raiseSpendingRequest(
            "Spending request test - 2",
            '300'
        ).send({
            from: accounts[0],
            gas: '1000000'
        });
        let srCount = await campaign.methods.cSpendingRequestsCount().call();

        assert(srCount == 2);
    });

    it('Lets donors vote on spending request', async () => {
        await campaign.methods.donateToCampaign()
        .send({
            from: accounts[1],
            gas: '1000000',
            value: '200'
        });
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[2],
                gas: '1000000',
                value: '200'
            });
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[3],
                gas: '1000000',
                value: '200'
            });

        // raise a spending request
        await campaign.methods.raiseSpendingRequest(
            "Spending request test - 1",
            '300'
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        // vote on the above spending request - [requestId = 0]
        await campaign.methods.voteOnSpendingRequest('0', '1')
            .send({
                from: accounts[1],
                gas: '1000000'
            });
        await campaign.methods.voteOnSpendingRequest('0', '2')
            .send({
                from: accounts[2],
                gas: '1000000'
            });
        await campaign.methods.voteOnSpendingRequest('0', '1')
            .send({
                from: accounts[3],
                gas: '1000000'
            });

        const request = await campaign.methods.cSpendingRequests(0).call();

        const numOfApprovers = request.srApprovalResponseCount;

        const numOfYay = request.srYayCount;

        assert.equal(3, numOfApprovers);
        assert.equal(2, numOfYay);
    });

    it('Lets manager finalize the spending request', async () => {
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[1],
                gas: '1000000',
                value: '200'
            });
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[2],
                gas: '1000000',
                value: '200'
            });
        await campaign.methods.donateToCampaign()
            .send({
                from: accounts[3],
                gas: '1000000',
                value: '200'
            });

        // raise a spending request
        await campaign.methods.raiseSpendingRequest(
            "Spending request test - 1",
            '300'
        ).send({
            from: accounts[0],
            gas: '1000000'
        });

        // vote on the above spending request - [requestId = 0]
        await campaign.methods.voteOnSpendingRequest('0', '1')
            .send({
                from: accounts[1],
                gas: '1000000'
            });
        await campaign.methods.voteOnSpendingRequest('0', '2')
            .send({
                from: accounts[2],
                gas: '1000000'
            });
        await campaign.methods.voteOnSpendingRequest('0', '1')
            .send({
                from: accounts[3],
                gas: '1000000'
            });

        const managersBalBeforeFinalize = await web3.eth.getBalance(accounts[0]);
        const fundsInCampaignBefore = await web3.eth.getBalance(campaignAddress);
        await campaign.methods.finalizeSpendingRequest(0).send({
            from: accounts[0],
            gas: '1000000'
        });
        const fundsInCampaignAfter = await web3.eth.getBalance(campaignAddress);

        assert((fundsInCampaignBefore - fundsInCampaignAfter) == 300);
    });
});