import React from 'react';
import { Menu } from 'semantic-ui-react'

export default () => {
    return (
        <Menu style={{ marginTop: '10px' }}>
            <Menu.Item name='signup'>
                Fund Me
            </Menu.Item>
            <Menu.Menu position='right'>
                <Menu.Item name='help'>
                    Campaigns
                </Menu.Item>

                <Menu.Item name='createCampaign'>
                    +
                </Menu.Item>
            </Menu.Menu>
        </Menu>
    );
}