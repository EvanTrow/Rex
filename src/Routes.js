import React, { Component } from 'react';
import axios from 'axios';

import { firebaseAuth } from './firebase/constants';

import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';

import CssBaseline from '@mui/material/CssBaseline';
import CircularProgress from '@mui/material/CircularProgress';
import ErrorBoundary from './components/ErrorBoundary';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Landing from './components/Landing';
import Signin from './components/Signin/Signin';
import Signup from './components/Signin/Signup';
// import Forgot from './components/Signin/Forgot';
import Main from './components/App/Main';

import PrivacyPolicy from './components/PrivacyPolicy';
import TermsConditions from './components/TermsConditions';

function PrivateRoute({ component: Component, authed, ...rest }) {
	return <Route {...rest} render={(props) => (authed ? <Component {...props} /> : <Redirect to={{ pathname: '/signin', state: { from: props.location } }} />)} />;
}

function PublicRoute({ component: Component, authed, ...rest }) {
	return <Route {...rest} render={(props) => (authed ? <Redirect to='/app' /> : <Component {...props} />)} />;
}

export default class App extends Component {
	constructor(props) {
		super(props);
		this.state = {
			authed: false,
			approved: false,
			loading: true,
			user: null,

			maintenance: false,
		};
	}

	componentDidMount() {
		firebaseAuth().onAuthStateChanged((user) => {
			if (user) {
				console.log(user);

				axios({
					method: 'post',
					url: '/api/registration/user',
					data: {
						uid: user.uid,
						displayName: user.displayName,
						email: user.email,
						providerData: user.providerData,
					},
				}).then((response) => {
					console.log(response.data);
					this.setState({
						user: user,
						approved: response.data.approved === true ? true : false,
						authed: true,
						loading: false,
					});
				});
			} else {
				this.setState({
					user: null,
					authed: false,
					loading: false,
				});
			}
		});
	}

	getUserDetails = () => {
		this.setState({ loading: true });
		firebaseAuth()
			.currentUser.getIdToken()
			.then((token) => {
				axios
					.get(`/api/user/${firebaseAuth().currentUser.uid}`, {
						headers: { Authorization: 'Bearer '.concat(token) },
					})
					.then((response) => {
						console.log(response.data);
						this.setState({
							approved: response.data.approved === true ? true : false,
							loading: false,
						});
					})
					.catch((err) => {
						this.setState({ loading: false });
					});
			});
	};

	render() {
		return this.state.loading === true ? (
			<>
				<CssBaseline />
				<CircularProgress style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, margin: 'auto' }} />
			</>
		) : this.state.maintenance === true && this.state?.user?.uid !== 'jwpIwFNoPKh2YwRCbTkAJZypXyx2' ? (
			<div style={{ textAlign: 'center', padding: 20, font: '20px Helvetica, sans-serif' }}>
				<article style={{ display: 'block', textAlign: 'left', width: '90%', margin: '0 auto' }}>
					<h1 style={{ fontSize: '50px' }}>We&rsquo;ll be back soon!</h1>
					<div>
						<p>Sorry for the inconvenience but we&rsquo;re performing some maintenance at the moment. We&rsquo;ll be back online shortly!</p>
						<p>&mdash; Evan</p>
					</div>
				</article>
			</div>
		) : (
			<ErrorBoundary>
				<CookiesProvider>
					<CssBaseline />
					<BrowserRouter>
						<Switch>
							<PublicRoute authed={this.state.authed} exact path='/' component={Landing} />
							<Route exact path='/policy' component={PrivacyPolicy} />
							<Route exact path='/terms' component={TermsConditions} />
							<PublicRoute authed={this.state.authed} exact path='/signin' component={Signin} />
							<PublicRoute authed={this.state.authed} exact path='/signup' component={Signup} />
							{/* <PublicRoute authed={this.state.authed} exact path='/forgot' component={Forgot} /> */}
							{this.state.approved && <PrivateRoute authed={this.state.authed} path='/app' component={(props) => <Main {...props} user={this.state.user} />} />}
						</Switch>

						<Dialog open={this.state.authed && !this.state.approved && !this.state.loading}>
							<DialogTitle id='alert-dialog-title'>Unapproved Account</DialogTitle>
							<DialogContent>
								<DialogContentText id='alert-dialog-description'>This account has not been approved. Please come back later.</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={this.getUserDetails}>Refresh</Button>
							</DialogActions>
						</Dialog>
					</BrowserRouter>
				</CookiesProvider>
			</ErrorBoundary>
		);
	}
}
