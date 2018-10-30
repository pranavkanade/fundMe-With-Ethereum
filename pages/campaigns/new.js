import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input } from 'semantic-ui-react';
import factory from '../../contracts/factory';
import web3 from '../../contracts/web3';

class CampaignNew extends Component {
    state = {
        description: '',
        minContib: ''
    };

    onSubmit = async (event) => {
        event.preventDefault(); // keeps browser from submit form

        const accounts = await web3.eth.getAccounts();
        await factory.methods
            .startCampaign(this.state.description, this.state.minContib)
            .send({
                from: accounts[0]
            });
    }

    render () {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit}>
                    <Form.Field>
                    <label>Campaign Description</label>
                    <Input
                        placeholder='To save the humanity'
                        value={this.state.description}
                        onChange={event => this.setState({ description: event.target.value })}
                    />
                    </Form.Field>
                    <Form.Field>
                    <label>Minimun Contribution</label>
                    <Input
                        label="wei" placeholder='1000' labelPosition="right"
                        value={this.state.minContib}
                        onChange={event => this.setState({ minContib: event.target.value})}
                    />
                    </Form.Field>
                    <Button primary>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;