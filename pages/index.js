import React, {Component} from 'react';
import factory from '../contracts/factory';
import { Card } from 'semantic-ui-react'

class CampaignIndex extends Component {
    // this runs every time the next server renders the JSX
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedContracts().call();
        return { campaigns };
    }

    renderCampaigns() {
        const items = this.props.campaigns.map(address => {
            return {
                header: address,
                description: <a>View campaign</a>,
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return <div>
            <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.0/dist/semantic.min.css"></link>
            {this.renderCampaigns()}
        </div>;
    }
}

export default CampaignIndex;