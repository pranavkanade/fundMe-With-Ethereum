import React, { Component } from "react";
import Layout from "../../components/Layouts";
import { Form, Button, Input, Message } from "semantic-ui-react";
import factoryInstance from "./../../contracts/factory";
import web3 from "./../../contracts/web3";

class CampaignNew extends Component {
  state = {
    newCampaignDescription: "",
    newCampaignMinContribution: "",
    errMessage: "",
    loading: false
  };

  onSubmit = async event => {
    event.preventDefault();
    // this has to be done
    this.setState({ loading: true });
    this.setState({ errMessage: "" });
    try {
      await web3.currentProvider.enable();

      let accounts = await web3.eth.getAccounts();

      await factoryInstance.methods
        .startCampaign(
          this.state.newCampaignDescription,
          this.state.newCampaignMinContribution
        )
        .send({
          from: accounts[0]
        });
    } catch (err) {
      this.setState({ errMessage: err.message });
    }

    this.setState({ loading: false });
  };

  render() {
    return (
      <Layout>
        <h3>Create new Campaign!</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errMessage}>
          <Form.Field>
            <label>Description</label>
            <Input
              placeholder="Fund me to change the world !"
              value={this.state.newCampaignDescription}
              onChange={event => {
                this.setState({ newCampaignDescription: event.target.value });
              }}
            />
          </Form.Field>
          <Form.Field>
            <label>Minimum Allowed Contribution</label>
            <Input
              label="wei"
              placeholder="1000"
              labelPosition="right"
              value={this.state.newCampaignMinContribution}
              onChange={event => {
                this.setState({
                  newCampaignMinContribution: event.target.value
                });
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

export default CampaignNew;
