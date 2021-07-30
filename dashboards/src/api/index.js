// @flow
import {API} from './interfaces';
import ExecMFAPI from './execMFAPI';
import FakeAPI from './fakeAPI';

const configureAPI = (): API => {
	if (process.env.NODE_ENV === 'development') {
		return new FakeAPI();
	}

	return new ExecMFAPI();
};

const apiInstance = configureAPI();

export default apiInstance;
