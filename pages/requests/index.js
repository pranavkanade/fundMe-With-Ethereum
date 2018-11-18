import React, { Component } from "react";
import Layout from "./../../components/Layouts";
import { Form, Button, Input, Message, Card, Grid } from "semantic-ui-react";
import Campaign from "./../../contracts/campaign";
import web3 from "./../../contracts/web3";
import { Link, Router } from "./../../routes";

class CampaignViewAllSpendingRequest extends Component {
  state = {};

  static async getInitialProps(props) {
    const address = props.query.address;
    try {
      const campaign = Campaign(address);
      let srCount = await campaign.methods.cSpendingRequestsCount().call();
      let listSRSummary = [];
      for (let i = 0; i < srCount; i++) {
        let sum_temp = await campaign.methods
          .getSpendingRequestSummary(i)
          .call();
        listSRSummary.push({
          srid: sum_temp[0],
          amount: sum_temp[1],
          desc: sum_temp[2],
          yayCount: sum_temp[3],
          totalVotes: sum_temp[4],
          isFinalized: sum_temp[5]
        });
      }
      return {
        errMessage: "",
        cAddress: address,
        listSRSummary: listSRSummary
      };
    } catch (err) {
      return {
        errMessage: err.message,
        cAddress: address,
        listSRSummary: []
      };
    }
  }

  renderSpendingReqs() {
    const srList = this.props.listSRSummary.map(object => {
      return {
        header: object.desc,
        description: object.amount + " wei",
        href: `/campaigns/${this.props.cAddress}/requests/${object.srid}`
      };
    });
    return <Card.Group items={srList} />;
  }

  render() {
    return (
      <Layout>
        <h3>List of all spending requests</h3>
        <Grid columns="equal">
          <Grid.Column>
            <Grid.Row stretched>
              <Grid.Column>{this.renderSpendingReqs()}</Grid.Column>
            </Grid.Row>
          </Grid.Column>
        </Grid>
      </Layout>
    );
  }
}

export default CampaignViewAllSpendingRequest;
