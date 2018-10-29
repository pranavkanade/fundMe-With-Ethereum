import web3 from './web3';
import FactoryCampaign from './build/FactoryCampaign.json';

const instance = new web3.eth.Contract(
    JSON.parse(FactoryCampaign.interface),
    '0x524E0151DFbbf32a446BF55e2A13b9918C7dB6e9'
);

export default instance;
