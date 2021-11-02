import React from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

import Trending from './Trending';

class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: '1',
		};
	}

	handleChange = (event, newValue) => {
		this.setState({ tab: newValue });
	};

	render() {
		console.log((window.innerWidth - 250) / 200);

		return (
			<Box sx={{ width: '100%', typography: 'body1' }}>
				<TabContext value={this.state.tab}>
					<Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
						<TabList onChange={this.handleChange} aria-label='lab API tabs example'>
							<Tab label='Popular' value='1' />
							<Tab label='Trending' value='2' />
						</TabList>
					</Box>
					<TabPanel value='1'>Item One</TabPanel>
					<TabPanel value='2'>
						<Trending />
					</TabPanel>
				</TabContext>
			</Box>
		);
	}
}

export default Landing;
