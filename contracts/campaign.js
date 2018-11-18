import web3 from "./web3";
import compiledFactoryCampaign from "./build/Campaign.json";

const Campaign = address => {
  return new web3.eth.Contract(
    JSON.parse(compiledFactoryCampaign.interface),
    address
  );
};

export default Campaign;
