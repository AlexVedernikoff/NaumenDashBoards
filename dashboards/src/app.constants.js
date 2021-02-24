// @flow
import {configureStore} from 'store';
import DashboardResizer from 'utils/dashboardResizer';

const store = configureStore();
const resizer = new DashboardResizer(store);
const root = document.getElementById('root');

export {
	resizer,
	root,
	store
};
