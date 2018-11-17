import React, { Component } from "react";
import Layout from "../../components/Layouts";
import { Form, Button, Input } from "semantic-ui-react";
class CampaignNew extends Component {
  state = {
    newCampaignDescription: "",
    newCampaignMinContribution: ""
  };

  onSubmit = () => {
    console.log("Desc : ", this.state.newCampaignDescription);
    console.log("Min Contrib : ", this.state.newCampaignMinContribution);
  };

  render() {
    return (
      <Layout>
        <h3>Create new Campaign!</h3>
        <Form onSubmit={this.onSubmit}>
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
          <Button type="submit" primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
