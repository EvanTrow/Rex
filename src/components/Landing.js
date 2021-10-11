import React from 'react';

import { isMobile } from 'react-device-detect';

import { Link } from 'react-router-dom';

import { withTheme } from '@mui/styles';
// import withWidth from '@mui/material/withWidth';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Avatar from '@mui/material/Avatar';

import green from '@mui/material/colors/green';
import red from '@mui/material/colors/red';
import blue from '@mui/material/colors/blue';
import orange from '@mui/material/colors/orange';

class Landing extends React.Component {
	constructor(props) {
		super(props);

		this.style = {
			landing: {
				paper: {
					padding: 24,
				},
				card: {
					title: {
						fontWeight: 'bold',
						marginTop: 20,
					},
				},
			},
			color: '',
		};
	}

	render() {
		const { width, theme } = this.props;
		// console.log(theme.palette.primary[theme.palette.type]);

		this.style.color = theme.palette.primary[theme.palette.type === 'dark' ? theme.palette.type : 'main'];

		return (
			<div style={{ flexGrow: 1 }}>
				<AppBar position='static' style={{ backgroundColor: this.style.color }}>
					<Toolbar>
						<Typography variant='h6' style={{ flexGrow: 1 }}>
							<img style={{ height: 36, position: 'relative', bottom: -4 }} src='/images/dino_white.png' alt='icon' />
						</Typography>
						<Button component={Link} to='/signin' color='inherit'>
							Login
						</Button>
					</Toolbar>
				</AppBar>

				<Container style={{ paddingTop: isMobile ? 20 : 80, marginBottom: 96 }}>
					<Grid container spacing={3}>
						<Grid container item sm={12} md={6} spacing={3}>
							<Grid item xs={12}>
								<Typography variant='h4'>Rex</Typography>
								<Typography variant='h6'>A request tool for Plex.</Typography>
								<Button component={Link} to='/signup' variant='contained' size='large' color='primary' style={{ marginTop: 48, backgroundColor: this.style.color }}>
									Get Started
								</Button>
							</Grid>
						</Grid>
						<Grid container item sm={12} md={6} spacing={3} direction='row'>
							<Grid item xs={12} sm={6}>
								<Paper style={this.style.landing.paper} elevation={9}>
									<Avatar aria-label='recipe' style={{ backgroundColor: green[500] }}>
										<i className='fas fa-search'></i>
									</Avatar>
									<Typography variant='subtitle1' style={this.style.landing.card.title}>
										Request
									</Typography>
									<Typography variant='subtitle2'>Movies and TV Shows.</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={6} style={{ paddingTop: width !== 'xs' ? 48 : 12 }}>
								<Paper style={this.style.landing.paper} elevation={9}>
									<Avatar aria-label='recipe' style={{ backgroundColor: red[500] }}>
										<i className='fas fa-bell'></i>
									</Avatar>
									<Typography variant='subtitle1' style={this.style.landing.card.title}>
										Get Notified
									</Typography>
									<Typography variant='subtitle2'>Know when your request is completed.</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={6} style={{ marginTop: getMarginForCards(width) }}>
								<Paper style={this.style.landing.paper} elevation={9}>
									<Avatar aria-label='recipe' style={{ backgroundColor: blue[500] }}>
										<i className='fas fa-stream'></i>
									</Avatar>
									<Typography variant='subtitle1' style={this.style.landing.card.title}>
										UX
									</Typography>
									<Typography variant='subtitle2'>Easily manage your requests.</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={6}>
								<Paper style={this.style.landing.paper} elevation={9}>
									<Avatar aria-label='recipe' style={{ backgroundColor: orange[500] }}>
										<i className='fas fa-lock'></i>
									</Avatar>
									<Typography variant='subtitle1' style={this.style.landing.card.title}>
										Secure
									</Typography>
									<Typography variant='subtitle2'>Safe authentication using best practises.</Typography>
								</Paper>
							</Grid>
						</Grid>
					</Grid>
					{/* <Grid container item sm={12} spacing={3} justify='center' style={{ marginTop: 128 }}>
						<Grid item xs={12} sm={10} md={8}>
							<Typography variant='h4' style={{ marginBottom: 24 }} align='center'>
								Giving just got a whole lot better.
							</Typography>
							<Typography variant='body1' align='center'>
								Want to receive gifts that you know you will love? Giftamizer is the perfect answer. It’s your very own personal gift registry. Whether you’re online or in-store, you
								can add anything you’d like to receive – from your favourite bottle of wine or perfect pair of shoes to a new mountain bike or weekend away. Share with your friends or
								family and invite them to share with you!
							</Typography>
						</Grid>
						<Grid container item sm={12} spacing={3} direction='row' style={{ marginTop: 32 }}>
							<Grid item xs={12} sm={4}>
								<Paper style={this.style.landing.paper} elevation={9}>
									<Avatar aria-label='recipe' style={{ backgroundColor: green[500] }}>
										<i className='fas fa-cogs'></i>
									</Avatar>
									<Typography variant='subtitle1' style={this.style.landing.card.title}>
										Easily Add Gifts
									</Typography>
									<Typography variant='subtitle2'>
										Just copy-paste a url from Amazon or other populator retailers to automatically import the item details straight into Giftamizer.
									</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Paper style={this.style.landing.paper} elevation={9}>
									<Avatar aria-label='recipe' style={{ backgroundColor: blue[500] }}>
										<i className='fas fa-check'></i>
									</Avatar>
									<Typography variant='subtitle1' style={this.style.landing.card.title}>
										Planning
									</Typography>
									<Typography variant='subtitle2'>Your family and friends can mark gifts as reserved updated in real-time. No more duplicate gifts.</Typography>
								</Paper>
							</Grid>
							<Grid item xs={12} sm={4}>
								<Paper style={this.style.landing.paper} elevation={9}>
									<Avatar aria-label='recipe' style={{ backgroundColor: orange[500] }}>
										<i className='fas fa-baby-carriage'></i>
									</Avatar>
									<Typography variant='subtitle1' style={this.style.landing.card.title}>
										Do you have kids?
									</Typography>
									<Typography variant='subtitle2'>
										Giftamizer allows you to create multiple lists. No need to create multiple accounts for your children. Manage them all directly from your account.
									</Typography>
								</Paper>
							</Grid>
						</Grid>
					</Grid> */}
					{/* <Grid container spacing={3} justify='center' style={{ marginTop: 96 }}>
						<Grid item sm={8} spacing={3}>
							<Paper style={this.style.landing.paper} elevation={9}>
								<Typography variant='subtitle1'>This application is under development.</Typography>
								<Typography variant='subtitle2'> — Come Back Soon!</Typography>
							</Paper>
						</Grid>
					</Grid> */}
				</Container>
			</div>
		);
	}
}

export default withTheme(Landing);

function getMarginForCards(width) {
	switch (width) {
		case 'xs':
			return 0;
		case 'sm':
			return -35;
		case 'md':
			return -35;
		case 'lg':
			return -55;
		case 'xl':
			return -55;
		default:
			return 0;
	}
}
