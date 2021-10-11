import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import Routes from './Routes';

export default function App() {
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	const theme = React.useMemo(
		() =>
			createTheme({
				palette: {
					mode: prefersDarkMode ? 'dark' : 'light',
					primary: {
						light: '#ffd14c',
						main: '#e5a00d',
						dark: '#ae7200',
						contrastText: '#fff',
					},
					secondary: {
						light: '#ff8ca5',
						main: '#f25976',
						dark: '#ba204b',
						contrastText: '#fff',
					},
				},
			}),
		[prefersDarkMode]
	);

	return (
		<ThemeProvider theme={theme}>
			<Routes />
		</ThemeProvider>
	);
}
