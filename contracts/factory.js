import web3 from "./web3";
import compiledFactoryCampaign from "./build/FactoryCampaign.json";

const instance = new web3.eth.Contract(
  JSON.parse(compiledFactoryCampaign.interface),
  "0x524e0151dfbbf32a446bf55e2a13b9918c7db6e9"
);

export default instance;
