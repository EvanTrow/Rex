import { firebaseAuth, GoogleProvider } from './constants';
import axios from 'axios';

export function signupWithEmailPassword(email, password, name) {
	return firebaseAuth()
		.createUserWithEmailAndPassword(email, password)
		.then((result) => {
			saveUser(result.user, name);
			return result.user.updateProfile({
				displayName: name,
				photoURL: '/images/app_icon.png',
			});
		})
		.catch((error) => {
			return error;
		});
}

export function loginWithGoogle() {
	console.log('yeet123');
	return firebaseAuth()
		.signInWithPopup(GoogleProvider)
		.then((result) => {
			return result.user;
		})
		.catch((error) => {
			return error;
		});
}

export function loginWithEmail(email, password) {
	// return firebaseAuth().signInWithEmailAndPassword(email, password);

	return firebaseAuth()
		.signInWithEmailAndPassword(email, password)
		.then((user) => {
			return user;
		})
		.catch((error) => {
			return error;
		});
}

export function resetPassword(email) {
	return firebaseAuth()
		.sendPasswordResetEmail(email)
		.then(function () {
			// Email sent.
			return 'ok';
		})
		.catch(function (error) {
			return 'error';
		});
}

export function logout() {
	return firebaseAuth().signOut();
}

export function getToken() {
	return firebaseAuth()
		.currentUser.getIdToken(/* forceRefresh */ true)
		.then(function (idToken) {
			return idToken;
		})
		.catch(function (error) {
			return error;
		});
}
export function getError(error) {
	console.log(error);

	var errorMessage;
	switch (error) {
		case 'auth/invalid-email':
			errorMessage = 'Your email address appears to be malformed.';
			break;
		case 'auth/email-already-in-use':
			errorMessage = 'Your email address is already in use.';
			break;
		case 'auth/wrong-password':
			errorMessage = 'Your password is wrong.';
			break;
		case 'auth/weak-password':
			errorMessage = 'Password is too weak.';
			break;
		case 'auth/user-not-found':
			errorMessage = 'Your password is wrong.';
			break;
		case 'auth/user-disabled':
			errorMessage = 'This account has been disabled.';
			break;
		case 'ERROR_TOO_MANY_REQUESTS':
			errorMessage = 'Too many requests. Try again later.';
			break;
		case 'auth/operation-not-allowed':
			errorMessage = 'Signing in with Email and Password is not enabled.';
			break;
		default:
			errorMessage = 'An undefined Error happened.';
	}
	return errorMessage;
}

function saveUser(user, name) {
	axios({
		method: 'post',
		url: '/api/registration/user',
		data: {
			uid: user.uid,
			displayName: name,
			email: user.email,
			providerData: user.providerData,
		},
	}).then((response) => {});
}
