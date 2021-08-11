// @flow
import {API} from './interfaces';
import ExecAPI from './execAPI';
import ExecMFAPI from './execMFAPI';
import FakeExecAPI from './fakeExecAPI';
import FakeExecMFAPI from './fakeExecMFAPI';

const configureAPI = (): API => {
	if (process.env.API_DRIVER === 'exec') {
		return new ExecAPI();
	} else if (process.env.API_DRIVER === 'exec-dev') {
		return new FakeExecAPI();
	} else if (process.env.API_DRIVER === 'execMF') {
		return new ExecMFAPI();
	} else if (process.env.API_DRIVER === 'execMF-dev') {
		return new FakeExecMFAPI();
	}

	return new ExecAPI();
};

top.injectJsApi && top.injectJsApi(top, window);
const apiInstance = configureAPI();

export default apiInstance;
