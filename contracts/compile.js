const path = require('path');
const fs = require('fs-extra');
const solc = require('solc');

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaignPath = path.resolve(__dirname, 'src', 'Campaign.sol');
const source = fs.readFileSync(campaignPath, 'utf-8');

const contracts = solc.compile(source, 1).contracts;

for (let each_contract in contracts) {
    fs.outputJSONSync (
        path.resolve(buildPath, each_contract.replace(':', '') + '.json'),
        contracts[each_contract]
    );
}