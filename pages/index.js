import React, { Component } from "react";
import factoryInstance from "./../contracts/factory";

class CampaignIndex extends Component {
  async componentDidMount() {
    // this function is to load the data
    // const campaigns = await factoryInstance.methods
    //   .getDeployedContracts()
    //   .call();
    // console.log(campaigns);
  }

  static async getInitialProps() {
    // this method is alternative to `componentDidMount` inside
    // the next nextjs server. So use it to fetch the data.
    // Hence we can use serverside rendering.
    // this function will be called without rendering this component
    const campaigns = await factoryInstance.methods
      .getDeployedContracts()
      .call();
    return { campaigns };
  }

  render() {
    return <div>{this.props.campaigns[0]}</div>;
  }
}

export default CampaignIndex;
