import React, { useState } from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Copyright() {
	return (
		<Typography variant='body2' color='textSecondary' align='center'>
			{'Copyright © '}
			<Link color='inherit' href='https://rex.trowbridge.tech'>
				Rex
			</Link>{' '}
			{new Date().getFullYear()}
			{'.'}
		</Typography>
	);
}
