import React from 'react';
import axios from 'axios';

import { firebaseAuth } from '../../../firebase/constants';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

import CircularProgress from '@mui/material/CircularProgress';

import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			tab: '1',

			items: [],
		};
	}

	componentDidMount() {
		if (!this.state.loaded) {
			this.setState({ loaded: true }, () => {
				this.getLibraries(1);
				// this.getLibraries(2);
			});
		}
	}

	getLibraries = (page) => {
		this.setState({ loading: true });
		firebaseAuth()
			.currentUser.getIdToken()
			.then((token) => {
				axios
					.get(`/api/moviedb/trending?page=${page}`, {
						headers: { Authorization: 'Bearer '.concat(token) },
					})
					.then((response) => {
						this.setState({
							items: [...this.state.items, ...response.data.results],
							loading: false,
						});
						// console.log(response.data.MediaContainer.Directory);
					})
					.catch((err) => {
						this.setState({ loading: false });
					});
			});
	};

	Item = (props) => {
		return (
			<Card Button sx={{ width: 167 }} onClick={() => this.setState({ selected: props })}>
				<ButtonBase
					style={{
						display: 'block',
						textAlign: 'initial',
					}}
				>
					<div sx={{ position: 'relative' }}>
						{/* {(props.rating || props.audienceRating) && (
							<Avatar sx={{ width: 24, height: 24, fontSize: '0.9rem', position: 'absolute', top: 223, right: 16 }}>{props.rating || props.audienceRating}</Avatar>
						)} */}
						<CardMedia component='img' height='250' image={`https://image.tmdb.org/t/p/w400/${props.poster_path}`} alt={props.title || props.original_name} />
					</div>
					<CardContent>
						{props.parentTitle && (
							<Typography noWrap variant='body2'>
								{props.parentTitle}
							</Typography>
						)}
						<Typography noWrap variant='body2'>
							{props.name || props.title || props.original_name}
						</Typography>
					</CardContent>{' '}
				</ButtonBase>
			</Card>
		);
	};

	render() {
		console.log((window.innerWidth - 250) / 200);

		return (
			<div>
				{this.state.loading ? (
					<CircularProgress />
				) : (
					<Grid container direction='row' justifyContent='flex-start' alignItems='flex-start' spacing={2}>
						{this.state.items.map((i) => (
							<Grid key={i.id} item xs>
								<this.Item {...i} />
							</Grid>
						))}
					</Grid>
				)}
			</div>
		);
	}
}

export default Landing;
