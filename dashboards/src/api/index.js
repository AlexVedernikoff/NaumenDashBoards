// @flow
import {API} from './interfaces';
import ExecAPI from './execAPI';
import ExecMFAPI from './execMFAPI';
import FakeExecAPI from './fakeExecAPI';
import FakeExecMFAPI from './fakeExecMFAPI';

const configureAPI = (): API => {
	if (process.env.API_DRIVER === 'exec') {
		if (process.env.NODE_ENV === 'development') {
			return new FakeExecAPI();
		}

		return new ExecAPI();
	} else {
		if (process.env.NODE_ENV === 'development') {
			return new FakeExecMFAPI();
		}

		return new ExecMFAPI();
	}
};

top.injectJsApi && top.injectJsApi(top, window);
const apiInstance = configureAPI();

export default apiInstance;
