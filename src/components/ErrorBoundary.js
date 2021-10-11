import React, { Component } from 'react';

import { Alert, AlertTitle } from '@mui/lab';

class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = {
			hasError: false,
			error: '',
		};
	}

	static getDerivedStateFromError(error) {
		// Update state so the next render will show the fallback UI.
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		// You can also log the error to an error reporting service
		console.error('ErrorBoundary', { error: error, info: errorInfo });
		this.setState({ error: String(error) });
	}

	render() {
		if (this.state.hasError) {
			// You can render any custom fallback UI
			return (
				<div style={{ margin: 20 }}>
					<Alert severity='error'>
						<AlertTitle>Error</AlertTitle>
						{this.state.error}
					</Alert>
				</div>
			);
		}

		return this.props.children;
	}
}

export default ErrorBoundary;
