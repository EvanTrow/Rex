import React, { Component } from 'react';
import axios from 'axios';

import { isMobile } from 'react-device-detect';

import { instanceOf } from 'prop-types';
import { withCookies, Cookies } from 'react-cookie';
import { Route, Switch, Link } from 'react-router-dom';

import clsx from 'clsx';
import { withStyles } from '@mui/styles';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';

import NavLinks from './NavLinks';
import NavMobile from './NavMobile';

// gift
import Dashboard from './Dashboard';
// import Items from './Items/Items';

// import Lists from './Lists/Lists';
// import List from './Lists/List/Items';

// import Groups from './Groups/Groups';
// import Group from './Groups/Group/Group';
// import MemberItems from './Groups/Group/Members/Items';
// import ListItems from './Groups/Group/Members/List/Items';

// import ShoppingList from './ShoppingList/Items';

// import Me from './Me/Me';

const drawerWidth = isMobile ? 0 : 240;

const styles = (theme) => ({
	root: {
		display: 'flex',
	},
	toolbar: {
		paddingRight: 24, // keep right padding when drawer closed
	},
	toolbarIcon: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
		padding: '0 8px',
		...theme.mixins.toolbar,
	},
	appBar: {
		zIndex: theme.zIndex.drawer + 1,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
	},
	appBarShift: {
		marginLeft: drawerWidth,
		width: `calc(100% - ${drawerWidth}px)`,
		transition: theme.transitions.create(['width', 'margin'], {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
	},
	menuButton: {
		marginRight: 36,
	},
	menuButtonHidden: {
		display: 'none',
	},
	title: {
		flexGrow: 1,
		textDecoration: 'none',
	},
	drawerPaper: {
		position: 'relative',
		whiteSpace: 'nowrap',
		width: drawerWidth,
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.enteringScreen,
		}),
		overflowX: 'hidden',
	},
	drawerPaperClose: {
		overflowX: 'hidden',
		transition: theme.transitions.create('width', {
			easing: theme.transitions.easing.sharp,
			duration: theme.transitions.duration.leavingScreen,
		}),
		width: theme.spacing(7),
		[theme.breakpoints.up('sm')]: {
			width: theme.spacing(9),
		},
	},
	appBarSpacer: theme.mixins.toolbar,
	content: {
		flexGrow: 1,
		height: 'calc(100vh - 64px)',
		overflow: 'auto',
		marginTop: isMobile ? 56 : 64,
	},
	container: {
		paddingTop: theme.spacing(4),
		paddingBottom: theme.spacing(4),
	},
	fixedHeight: {
		height: 240,
	},
});

// export default function Gift(props) {
class Main extends Component {
	static propTypes = {
		cookies: instanceOf(Cookies).isRequired,
	};

	constructor(props) {
		super(props);
		this.state = {
			title: 'Dashboard',
			drawerOpen: props.cookies.get('DrawerOpen') === 'true',

			loading: true,
		};
	}

	// const [cookies, setCookie] = useCookies(['DrawerOpen']);

	// const classes = useStyles();
	// const [open, setOpen] = React.useState(cookies.DrawerOpen === 'true' ? true : JSON.stringify(cookies).indexOf('DrawerOpen') === -1 ? true : false);
	// const [title, setTitle] = React.useState('Dashboard');

	componentDidMount() {
		this.getUserDetails();
	}

	getUserDetails = () => {
		this.setState({ loading: true });

		axios({
			method: 'get',
			url: '/',
		}).then(function (response) {});
	};

	render() {
		const { classes, cookies } = this.props;

		const { drawerOpen, title } = this.state;

		const handleDrawerOpen = () => {
			this.setState(
				{
					drawerOpen: true,
				},
				() => {
					cookies.set('DrawerOpen', true, { path: '/' });

					console.log('set true');
				}
			);
		};
		const handleDrawerClose = () => {
			this.setState(
				{
					drawerOpen: false,
				},
				() => {
					cookies.set('DrawerOpen', false, { path: '/' });

					console.log('set false');
				}
			);
		};

		return (
			<div className={classes.root}>
				<AppBar position='absolute' className={clsx(classes.appBar, drawerOpen && classes.appBarShift)}>
					<Toolbar className={classes.toolbar}>
						{!isMobile && (
							<IconButton edge='start' color='inherit' aria-label='open drawer' onClick={handleDrawerOpen} className={clsx(classes.menuButton, drawerOpen && classes.menuButtonHidden)}>
								<MenuIcon />
							</IconButton>
						)}
						<Typography component={Link} to='/' variant='h6' color='inherit' noWrap className={classes.title}>
							{title}
						</Typography>
					</Toolbar>
				</AppBar>

				{!isMobile && (
					<Drawer
						variant='permanent'
						classes={{
							paper: clsx(classes.drawerPaper, !drawerOpen && classes.drawerPaperClose),
						}}
						open={drawerOpen}
					>
						<div className={classes.toolbarIcon}>
							<IconButton onClick={handleDrawerClose}>
								<ChevronLeftIcon />
							</IconButton>
						</div>
						<NavLinks {...this.props} />
					</Drawer>
				)}

				<main className={classes.content}>
					{/* <div className={classes.appBarSpacer} /> */}
					<div style={{ paddingBottom: isMobile ? 64 : 0 }}>
						<Switch>
							<Route exact path='/app' component={(props) => <Dashboard {...props} setTitle={() => {}} isMobile={isMobile} />} />
						</Switch>
					</div>
					{isMobile && <NavMobile />}
				</main>
			</div>
		);
	}
}
export default withCookies(withStyles(styles, { withTheme: true })(Main));
