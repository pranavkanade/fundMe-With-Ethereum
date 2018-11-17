import React, { Component } from "react";
import factoryInstance from "./../contracts/factory";

class CampaignIndex extends Component {
  async componentDidMount() {
    const campaigns = await factoryInstance.methods
      .getDeployedContracts()
      .call();
    console.log(campaigns);
  }

  render() {
    return <h1>Campaign Index!</h1>;
  }
}

export default CampaignIndex;
