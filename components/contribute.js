import React, { Component } from "react";
import Campaign from "./../contracts/campaign";
import { Grid, Form, Input, Card, Message } from "semantic-ui-react";

// TODO: Separate the contribute form

class CampaignContribute extends Component {
  state = {
    campaignContribution: "",
    errMessage: "",
    loading: false
  };

  render() {
    return (
      <Grid.Column>
        <Card fluid color="blue">
          <Card.Content>
            <Card.Header>
              {web3.utils.fromWei(this.props.cBalance, "ether")}
            </Card.Header>
            <Card.Meta>Ether</Card.Meta>
            <Card.Description>Total Contribution</Card.Description>
          </Card.Content>
        </Card>
        <Form onSubmit={this.onSubmit} error={!!this.state.errMessage}>
          <Form.Field>
            <label>Contribute</label>
            <Input
              label="wei"
              placeholder="1000"
              labelPosition="right"
              value={this.state.campaignContribution}
              onChange={event => {
                this.setState({
                  campaignContribution: event.target.value
                });
              }}
            />
          </Form.Field>
          <Message error header="Sorry :(" content={this.state.errMessage} />
          <Button type="submit" primary loading={this.state.loading}>
            Contribute!
          </Button>
        </Form>
      </Grid.Column>
    );
  }
}
