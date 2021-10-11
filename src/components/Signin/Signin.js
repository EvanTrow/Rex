import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import { Link as domLink } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { makeStyles } from '@mui/styles';

import { loginWithEmail, loginWithGoogle, getError } from '../../firebase/auth';

import Copyright from '../Copyright';

import Alert from '../Alert';
import Snackbar from '@mui/material/Snackbar';

const useStyles = makeStyles((theme) => ({
	root: {
		height: '100vh',
	},
	image: {
		backgroundImage: 'url(/images/signin/' + (Math.floor(Math.random() * 12) + 1) + '.jpg)',
		backgroundRepeat: 'no-repeat',
		backgroundColor: theme.palette.type === 'light' ? theme.palette.grey[50] : theme.palette.grey[900],
		backgroundSize: 'cover',
		backgroundPosition: 'center',
	},
	paper: {
		margin: theme.spacing(8, 4),
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
	},
	avatar: {
		margin: theme.spacing(1),
		backgroundColor: theme.palette.primary.main,
	},
	form: {
		width: '100%', // Fix IE 11 issue.
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

export default function SignInSide() {
	const classes = useStyles();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [alert, setAlert] = React.useState({ open: false, message: '', severity: 'info' });
	const handleClose = (event, reason) => {
		setAlert({ open: false, message: alert.message, severity: alert.severity });
	};

	return (
		<Grid container component='main' className={classes.root}>
			<CssBaseline />
			<Grid item xs={false} sm={4} md={7} xl={9} className={classes.image} />
			<Grid item xs={12} sm={8} md={5} xl={3} component={Paper} elevation={6} square>
				<div className={classes.paper}>
					<Avatar className={classes.avatar}>
						<LockOutlinedIcon />
					</Avatar>
					<Typography component='h1' variant='h5'>
						Sign in
					</Typography>
					<Grid container spacing={2} style={{ marginTop: 8 }}>
						<Grid item xs={12}>
							<Button
								variant='contained'
								style={{ background: '#4285f4', color: '#fff' }}
								startIcon={<i class='fab fa-google'></i>}
								fullWidth
								onClick={() => {
									loginWithGoogle().then((result) => {
										console.log(result);
										if (result.code) {
											console.log(result);
											setAlert({ open: true, message: 'Error signing in!', severity: 'error' });
										}
									});
								}}
							>
								sign in with google
							</Button>
						</Grid>
						<Grid item xs={12}>
							<center> — OR — </center>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								label='Email Address'
								autoComplete='email'
								autoFocus
								value={email}
								onChange={(event) => setEmail(event.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										loginWithEmail(email, password).then((result) => {
											if (result.code) {
												setAlert({ open: true, message: getError(result.code), severity: 'warning' });
											}
										});
									}
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								variant='outlined'
								required
								fullWidth
								label='Password'
								type='password'
								autoComplete='current-password'
								value={password}
								onChange={(event) => setPassword(event.target.value)}
								onKeyDown={(e) => {
									if (e.key === 'Enter') {
										loginWithEmail(email, password).then((result) => {
											if (result.code) {
												setAlert({ open: true, message: getError(result.code), severity: 'warning' });
											}
										});
									}
								}}
							/>
						</Grid>
						<Grid item xs={12}>
							<Button
								type='submit'
								fullWidth
								variant='contained'
								color='primary'
								className={classes.submit}
								onClick={() => {
									loginWithEmail(email, password).then((result) => {
										if (result.code) {
											setAlert({ open: true, message: getError(result.code), severity: 'warning' });
										}
									});
								}}
							>
								Sign In
							</Button>
						</Grid>
					</Grid>
					<Grid container>
						<Grid item xs>
							<Link component={domLink} to='/forgot' variant='body2'>
								Forgot password?
							</Link>
						</Grid>
						<Grid item>
							<Link component={domLink} to='/signup' variant='body2'>
								{"Don't have an account? Sign Up"}
							</Link>
						</Grid>
					</Grid>
					<Box mt={5}>
						<Copyright />
					</Box>
				</div>
			</Grid>
			<Snackbar open={alert.open} autoHideDuration={3500} onClose={handleClose}>
				<Alert onClose={handleClose} severity={alert.severity}>
					{alert.message}
				</Alert>
			</Snackbar>
		</Grid>
	);
}
