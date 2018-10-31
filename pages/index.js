import React, {Component} from 'react';
import factory from '../contracts/factory';
import { Card, Button, Grid } from 'semantic-ui-react'
import Layout from '../components/Layout'
import { Link } from '../routes';

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
                description: (
                    <Link route={`/campaigns/${address}`}>
                        <a>View campaign</a>
                    </Link>
                ),
                fluid: true
            };
        });

        return <Card.Group items={items} />;
    }

    render() {
        return (
            <Layout>
                <div>
                    <h3>Open Campaign</h3>
                    <Grid columns='equal'>

                        <Grid.Column>
                            {this.renderCampaigns()}
                        </Grid.Column>
                        <Grid.Column width={4}>
                        <Link route="/campaigns/new">
                            <a>
                                <Button content='Create Campaign' icon='add' labelPosition='right' primary/>
                            </a>
                        </Link>
                        </Grid.Column>
                    </Grid>
                </div>
            </Layout>
        );
    }
}

export default CampaignIndex;