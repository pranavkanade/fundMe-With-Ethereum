import React, { Component } from "react";
import Layout from "../../components/Layouts";
import { Form, Button } from "semantic-ui-react";
class CampaignNew extends Component {
  render() {
    return (
      <Layout>
        <h3>Create new Campaign!</h3>
        <Form>
          <Form.Field>
            <label>Description</label>
            <input placeholder="Fund me to change the world !" />
          </Form.Field>
          <Form.Field>
            <label>Minimum Allowed Contribution</label>
            <input placeholder="1 ether" />
          </Form.Field>
          <Button type="submit" primary>
            Create
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
