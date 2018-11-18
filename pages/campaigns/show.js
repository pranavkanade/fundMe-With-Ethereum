import React, { Component } from "react";
import Layout from "./../../components/Layouts";
import Campaign from "./../../contracts/campaign";
import {
  Card,
  Grid,
  Header,
  Icon,
  Form,
  Input,
  Button,
  Message,
  Divider
} from "semantic-ui-react";
import web3 from "./../../contracts/web3";
import { Link } from "./../../routes";

class CampaignShow extends Component {
  state = {
    campaignContribution: "",
    errMessage: "",
    loading: false
  };

  static async getInitialProps(props) {
    try {
      console.log("getting the summary");
      const campaign = Campaign(props.query.address);
      console.log("got campaign instance from : ", campaign.options.address);
      let campaignSummary = await campaign.methods.getCampaignSummary().call();
      console.log(campaignSummary);
      return {
        cAddress: props.query.address,
        cManager: campaignSummary[0],
        cDescription: campaignSummary[1],
        cMinContrib: campaignSummary[2],
        cBalance: campaignSummary[3],
        cDonorCount: campaignSummary[4],
        cSrCount: campaignSummary[5]
      };
    } catch (err) {
      return {
        errMessage: "Failed to get the campaign summary"
      };
    }
  }

  onSubmit = async event => {
    event.preventDefault();
    console.log("contributing : ", this.state.campaignContribution);

    this.setState({ errMessage: "" });
    this.setState({ loading: true });
    try {
      console.log("in try");
      const campaign = Campaign(this.props.cAddress);
      console.log("got campaign instance");
      let accounts = await web3.eth.getAccounts();
      console.log("got accounts");
      await campaign.methods.donateToCampaign().send({
        from: accounts[0],
        value: this.state.campaignContribution
      });
      console.log("contributed");
    } catch (err) {
      this.setState({ errMessage: err.message });
    }
    this.setState({ loading: false });
  };

  renderSummary() {
    const items = [
      {
        header: this.props.cManager,
        description:
          "User address the campaign manager. This account can raise spending requests.",
        meta: "Owner",
        style: { overflowWrap: "break-word" }
      },
      {
        header: this.props.cDonorCount,
        description:
          "Number of people that have already donated to this campaign.",
        meta: "Approvers"
      },
      {
        header: this.props.cMinContrib + " wei",
        description:
          "Minimum contribution in wei to become the approver of this campaign.",
        meta: "Minimum Contribution (wei)"
      },
      {
        header: this.props.cSrCount,
        description:
          "Number of spending requests initiated by the manager of the campaign.",
        meta: "Spending Requests",
        link: true,
        color: "red",
        href: "/campaigns/" + this.props.cAddress + "/requests"
      }
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <div>
          <h3>Campaign Details !</h3>
          <Grid columns="equal">
            <Grid.Row centered>
              <Header as="h3" icon textAlign="center">
                <Icon name="dolly flatbed" circular />
                <Header.Content>{this.props.cDescription}</Header.Content>
                <Header.Subheader>{this.props.cAddress}</Header.Subheader>
              </Header>
            </Grid.Row>
            <Grid.Row stretched>
              <Grid.Column width={10}>
                <Grid.Row stretched>
                  <Grid.Column>{this.renderSummary()}</Grid.Column>
                  <Divider hidden />
                  <Link
                    route={`/campaigns/${this.props.cAddress}/requests/new`}
                  >
                    <a>
                      <Button
                        floated="left"
                        content="create spending request"
                        icon="money bill alternate"
                        labelPosition="right"
                        primary
                      />
                    </a>
                  </Link>
                </Grid.Row>
              </Grid.Column>
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
                  <Message
                    error
                    header="Sorry :("
                    content={this.state.errMessage}
                  />
                  <Button type="submit" primary loading={this.state.loading}>
                    Contribute!
                  </Button>
                </Form>
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </div>
      </Layout>
    );
  }
}

export default CampaignShow;
