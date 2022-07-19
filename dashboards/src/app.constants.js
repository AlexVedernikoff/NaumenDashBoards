// @flow
import {configureStore} from 'store';
import dashboardResizer from 'utils/dashboardResizer';

const store = configureStore();
const resizer = dashboardResizer;
const root = document.getElementById('root');

dashboardResizer.setStore(store);

export {
	resizer,
	root,
	store
};
