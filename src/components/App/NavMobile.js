import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { makeStyles } from '@mui/styles';

import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';

import DashboardIcon from '@mui/icons-material/Dashboard';

import MovieIcon from '@mui/icons-material/Movie';
import LiveTvIcon from '@mui/icons-material/LiveTv';

import ListAltIcon from '@mui/icons-material/ListAlt';
import GroupIcon from '@mui/icons-material/Group';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const useStyles = makeStyles({
	root: {
		width: '100%',
		position: 'fixed',
		bottom: 0,
	},
});

export default function SimpleBottomNavigation() {
	const history = useHistory();
	const location = useLocation();

	const classes = useStyles();
	const [value, setValue] = React.useState(getLocation(location.pathname));

	return (
		<BottomNavigation
			value={value}
			onChange={(event, newValue) => {
				setValue(newValue);
				switch (newValue) {
					case 0:
						history.push('/app/db/movies');
						break;
					case 1:
						history.push('/app/db/tv');
						break;
					case 2:
						history.push('/app');
						break;
					case 3:
						history.push('/app/requests');
						break;
					case 4:
						history.push('/app/me');
						break;

					default:
						break;
				}
			}}
			showLabels
			className={classes.root}
		>
			<BottomNavigationAction label='Movies' icon={<MovieIcon />} />
			<BottomNavigationAction label='Shows' icon={<LiveTvIcon />} />
			<BottomNavigationAction label='Dashboard' icon={<DashboardIcon />} />
			<BottomNavigationAction label='Requests' icon={<ListAltIcon />} />
			<BottomNavigationAction label='Account' icon={<AccountCircleIcon />} />
		</BottomNavigation>
	);
}

function getLocation(path) {
	// console.log(path);
	if (path.startsWith('/app/db/movies')) {
		return 0;
	} else if (path.startsWith('/app/db/tv')) {
		return 1;
	} else if (path.startsWith('/app')) {
		return 2;
	} else if (path.startsWith('/app/requests')) {
		return 3;
	} else if (path.startsWith('/app/me')) {
		return 4;
	} else {
		return -1;
	}
}
