import React from 'react';
import axios from 'axios';

import moment from 'moment';
import momentDurationFormatSetup from 'moment-duration-format';

import { Link } from 'react-router-dom';

import { firebaseAuth } from '../../firebase/constants';
import { isMobile } from 'react-device-detect';

import { withStyles } from '@mui/styles';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import CircularProgress from '@mui/material/CircularProgress';

import Card from '@mui/material/Card';
import ButtonBase from '@mui/material/ButtonBase';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';

import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';

momentDurationFormatSetup(moment);

// import WarningIcon from '@mui/icons-material/Warning';

const StyledBadge = withStyles((theme) => ({
	badge: {
		top: -4,
		right: -8,
		padding: 6,
		height: 10,
		fontSize: '0.55rem',
		zIndex: 0,
	},
}))(Badge);

class Landing extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loaded: false,

			groups: [],
			loading: true,

			libraries: [],

			selected: null,
		};
	}

	componentDidMount() {
		if (!this.state.loaded) {
			this.setState({ loaded: true }, () => {
				this.getLibraries();
			});
		}
	}

	getLibraries = () => {
		this.setState({ loading: true });
		firebaseAuth()
			.currentUser.getIdToken()
			.then((token) => {
				axios
					.get(`/api/plex/libraries`, {
						headers: { Authorization: 'Bearer '.concat(token) },
					})
					.then((response) => {
						// console.log(response.data.MediaContainer.Directory);

						this.setState({
							libraries: response.data.MediaContainer.Directory,
							loading: false,
						});

						response.data.MediaContainer.Directory.forEach((library) => {
							this.setState(
								{
									['library-' + library.key]: [],
								},
								() => this.getRecent(library)
							);
						});
					})
					.catch((err) => {
						this.setState({ loading: false });
					});
			});
	};

	getRecent = (library) => {
		this.setState({ ['loading-' + library.key]: true });
		firebaseAuth()
			.currentUser.getIdToken()
			.then((token) => {
				axios
					.get(`/api/plex/recent/${library.key}`, {
						headers: { Authorization: 'Bearer '.concat(token) },
					})
					.then((response) => {
						console.log(response.data.MediaContainer.Metadata);

						this.setState({
							['library-' + library.key]: response.data.MediaContainer.Metadata,
							['loading-' + library.key]: false,
						});
					})
					.catch((err) => {
						this.setState({ ['loading-' + library.key]: false });
					});
			});
	};

	Item = (props) => {
		return (
			<Card Button sx={{ maxWidth: 167 }} onClick={() => this.setState({ selected: props })}>
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
						<CardMedia component='img' height='250' image={`/api/plex/media?url=${props.thumb}`} alt={props.title} />
					</div>
					<CardContent>
						{props.parentTitle && (
							<Typography noWrap variant='body2'>
								{props.parentTitle}
							</Typography>
						)}
						<Typography noWrap variant='body2' color='text.secondary'>
							{props.title}
						</Typography>
					</CardContent>{' '}
				</ButtonBase>
			</Card>
		);
	};

	render() {
		console.log((window.innerWidth - 250) / 200);

		return (
			<div style={{ margin: 16 }}>
				{this.state.loading ? (
					<CircularProgress />
				) : (
					<Grid container id='media-viewer'>
						{this.state.libraries.map(({ key, title }) => (
							<Grid key={key} item xs={12}>
								<Typography variant='h6'>Recently Added {title}:</Typography>

								{/* {this.state?.['library-' + key]?.length} */}
								{this.state?.['library-' + key]?.length > 0 ? (
									<Carousel
										additionalTransfrom={0}
										arrows
										autoPlaySpeed={3000}
										centerMode={false}
										className=''
										containerClass='container-with-dots'
										dotListClass=''
										draggable
										focusOnSelect={false}
										infinite={false}
										itemClass=''
										keyBoardControl
										minimumTouchDrag={80}
										renderButtonGroupOutside={false}
										renderDotsOutside={false}
										responsive={{
											reee: {
												breakpoint: {
													max: 5000,
													min: 0,
												},
												items: window.document.getElementById('media-viewer').clientWidth / 180,
												partialVisibilityGutter: 170,
											},
										}}
										showDots={false}
										sliderClass=''
										slidesToSlide={Math.floor(window.document.getElementById('media-viewer').clientWidth / 180)}
										swipeable
									>
										{this.state?.['library-' + key]?.map((i) => (
											<this.Item {...i} />
										))}
									</Carousel>
								) : (
									<CircularProgress />
								)}
							</Grid>
						))}
					</Grid>
				)}

				<Dialog open={this.state.selected} scroll='body' onClose={() => this.setState({ selected: null })}>
					<Card>
						<CardMedia
							component='img'
							height='250'
							image={this.state.selected ? `/api/plex/media?url=${this.state.selected?.art || this.state.selected?.thumb}` : null}
							alt={this.state.selected?.title}
						/>
						<CardContent>
							<Typography gutterBottom variant='h5' component='div' gutterBottom>
								{this.state.selected?.title}
								<Typography color='text.secondary'>
									{this.state.selected?.originallyAvailableAt
										? moment(this.state.selected?.originallyAvailableAt).format('YYYY')
										: moment.unix(this.state.selected?.addedAt).format('MM/DD/YYYY')}{' '}
									— {moment.duration(this.state.selected?.duration / 1000 || 0, 'seconds').format('h [hr] m [min]')}
								</Typography>
							</Typography>
							<Typography variant='body2' gutterBottom>
								{this.state.selected?.summary}
							</Typography>
						</CardContent>
						<CardActions sx={{ float: 'right' }}>
							<Button size='small' onClick={() => this.setState({ selected: null })}>
								Close
							</Button>
						</CardActions>
					</Card>
				</Dialog>
			</div>
		);
	}
}

export default Landing;
