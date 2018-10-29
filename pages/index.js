import React, {Component} from 'react';
import factory from '../contracts/factory';

class CampaignIndex extends Component {
    // this runs every time the next server renders the JSX
    static async getInitialProps() {
        const campaigns = await factory.methods.getDeployedContracts().call();
        return { campaigns };
    }

    render() {
        return <div>{this.props.campaigns[0]}</div>
    }
}

export default CampaignIndex;