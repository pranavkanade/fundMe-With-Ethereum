import React, { Component } from 'react';
import Layout from '../../components/Layout';

class CampaignNew extends Component {
    state = {
        description: '',
        minContib: ''
    };

    onSubmit = () => {
        event.preventDefault(); // keeps browser from submit form

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
                    <Button type='submit' primary>Create!</Button>
                </Form>
            </Layout>
        );
    }
}

export default CampaignNew;