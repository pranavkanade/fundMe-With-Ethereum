import React, { Component } from "react";
import Layout from "./../../components/Layouts";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Campaign from "./../../contracts/campaign";
import web3 from "./../../contracts/web3";
import { Router } from "./../../routes";

class CampaignNewSpendingRequest extends Component {
  state = {
    srDescription: "",
    srAmount: "",
    loading: false,
    errMessage: ""
  };

  static async getInitialProps(props) {
    return {
      cAddress: props.query.address
    };
  }

  onSubmit = async event => {
    event.preventDefault();
    this.setState({
      loading: true,
      errMessage: ""
    });
    const address = this.props.cAddress;
    try {
      // get the handle on campaign object
      let accounts = await web3.eth.getAccounts();

      const campaign = Campaign(address);
      await campaign.methods
        .raiseSpendingRequest(this.state.srDescription, this.state.srAmount)
        .send({ from: accounts[0] });

      Router.pushRoute("/campaigns/" + address + "/requests/");
    } catch (err) {
      this.setState({ errMessage: err.message });
    }
    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create new spending request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              placeholder="Payment - Buying a PC"
              value={this.state.srDescription}
              onChange={event => {
                this.setState({ srDescription: event.target.value });
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Amount to Spend</label>
            <Input
              label="wei"
              labelPosition="right"
              placeholder="100"
              value={this.state.srAmount}
              onChange={event => {
                this.setState({ srAmount: event.target.value });
              }}
            />
          </Form.Field>
          <Message error header="Sorry :(" content={this.state.errMessage} />
          <Button type="submit" primary loading={this.state.loading}>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNewSpendingRequest;
