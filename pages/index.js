import React, {Component} from 'react';
import factory from '../contracts/factory';

class CampaignIndex extends Component {
    async componentDidMount() {
        const campaigns = await factory.methods.getDeployedContracts().call();
        console.log(campaigns);
    }

    render() {
        return <div>Campaign Index!</div>
    }
}

export default CampaignIndex;