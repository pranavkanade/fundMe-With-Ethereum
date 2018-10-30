import React, { Component } from 'react';
import Layout from '../../components/Layout';
import { Form, Button, Input, Message } from 'semantic-ui-react';
import factory from '../../contracts/factory';
import web3 from '../../contracts/web3';
import { parse } from 'path';

class CampaignNew extends Component {
    state = {
        description: '',
        minContib: '',
        errMessage: ''
    };

    onSubmit = async (event) => {
        event.preventDefault(); // keeps browser from submit form

        try {
            const accounts = await web3.eth.getAccounts();
            await factory.methods
                .startCampaign(this.state.description, this.state.minContib)
                .send({
                    from: accounts[0]
                });
        } catch (err) {
            this.setState({ errMessage: err.message });
        }
    }

    render () {
        return (
            <Layout>
                <h3>Create a Campaign</h3>
                <Form onSubmit={this.onSubmit} error={!!(this.state.errMessage)}>
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
                    <Message error header="Oops!" content={this.state.errMessage} />
                    <Button primary>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;