import React, { Component } from "react";
import Layout from "./../../components/Layouts";
import {
  Grid,
  Button,
  Message,
  Card,
  Header,
  Icon,
  Divider
} from "semantic-ui-react";
import Campaign from "./../../contracts/campaign";
import web3 from "./../../contracts/web3";
import { Router } from "./../../routes";

class CampaignShowSpendingRequest extends Component {
  state = {
    loading: false,
    errMessage: ""
  };
  static async getInitialProps(props) {
    const address = props.query.address;
    const reqId = props.query.reqid;
    try {
      const campaign = Campaign(address);
      const sum_temp = await campaign.methods
        .getSpendingRequestSummary(Number(reqId))
        .call();
      return {
        cAddress: address,
        srid: sum_temp[0],
        amount: sum_temp[1],
        desc: sum_temp[2],
        yayCount: sum_temp[3],
        totalVotes: sum_temp[4],
        isFinalized: sum_temp[5]
      };
    } catch (err) {
      return {
        cAddress: address,
        errMessage: err.message
      };
    }
  }

  renderSpendingRequestSummary() {
    const items = [
      {
        header: this.props.amount + " wei",
        description: "The amount of wei needs to be spent on the request",
        meta: "spending (wei)"
      },
      {
        header: this.props.yayCount,
        description: "Number of users that have Approved",
        meta: "YAYs",
        color: "green"
      },
      {
        header: this.props.totalVotes,
        description: "Number of users that have Voted",
        meta: "Votes",
        color: "blue"
      },
      {
        header: this.props.isFinalized ? "Finalized" : "Open to vote",
        description: "Number of users that have Voted",
        meta: "Votes",
        color: this.props.isFinalized ? "green" : "yellow"
      }
    ];
    return <Card.Group items={items} />;
  }

  sendApprovalResponse = async resId => {
    console.log("response : ", resId);
    try {
      this.setState({ loading: true });
      const address = this.props.cAddress;
      const srid = this.props.srid;
      const campaign = Campaign(address);
      let accounts = await web3.eth.getAccounts();
      await campaign.methods.voteOnSpendingRequest(srid, resId).send({
        from: accounts[0]
      });
      Router.pushRoute("/campaigns/" + address + "/requests/");
    } catch (err) {
      this.setState({ errMessage: err.message });
    }
    this.setState({ loading: false });
  };

  renderApprovalComponent = () => {
    return (
      <div>
        <Card fluid>
          <Card.Content>
            <Card.Header textAlign="center">Approve ?</Card.Header>
          </Card.Content>
          <Card.Content extra>
            <div className="ui two buttons">
              <Button
                basic
                positive
                loading={this.state.loading}
                value={true}
                onClick={event => {
                  this.sendApprovalResponse(1);
                }}
              >
                Approve
              </Button>
              <Button
                basic
                negative
                loading={this.state.loading}
                value={false}
                onClick={event => {
                  this.sendApprovalResponse(2);
                }}
              >
                Decline
              </Button>
            </div>
          </Card.Content>
        </Card>
      </div>
    );
  };

  render() {
    return (
      <Layout>
        <div>
          <h3>Spending Request Details !</h3>
          <Grid columns="equal">
            <Grid.Row centered>
              <Header as="h3" icon textAlign="center">
                <Icon name="money bill alternate" circular />
                <Header.Content>{this.props.desc}</Header.Content>
                <Header.Subheader>{this.props.srid}</Header.Subheader>
              </Header>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column width={10}>
                <Grid.Row stretched>
                  <Grid.Column>
                    {this.renderSpendingRequestSummary()}
                  </Grid.Column>
                  <Divider hidden />
                </Grid.Row>
              </Grid.Column>
              <Grid.Column>{this.renderApprovalComponent()}</Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default CampaignShowSpendingRequest;
