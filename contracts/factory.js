import web3 from "./web3";
import compiledFactoryCampaign from "./build/FactoryCampaign.json";

const instance = new web3.eth.Contract(
  JSON.parse(compiledFactoryCampaign.interface),
  "0xF593FD378d007300F31b45C1C94D462e52Cf9136"
);

export default instance;
