import firebase from 'firebase';

const firebaseConfig = {
	apiKey: 'AIzaSyCbOW5pnbwTg__TVsveWe5VM9Nk6kXiEXE',
	authDomain: 'plex-request-8ac22.firebaseapp.com',
	projectId: 'plex-request-8ac22',
	storageBucket: 'plex-request-8ac22.appspot.com',
	messagingSenderId: '707166745309',
	appId: '1:707166745309:web:20fa21b757b73a02a6e134',
	measurementId: 'G-JWK7NBYXEJ',
};

firebase.initializeApp(firebaseConfig);

export const GoogleProvider = new firebase.auth.GoogleAuthProvider();

// export const db = firebase.firestore();
// export const storage = firebase.storage();
export const firebaseAuth = firebase.auth;
