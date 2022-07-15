// @flow
import configureStore from 'store';

const store = configureStore();
const container = document.getElementById('root');

export {
	container,
	store
};
