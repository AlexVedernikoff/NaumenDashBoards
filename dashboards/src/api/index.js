// @flow
import {API} from './interfaces';
import type {ApiConfig} from './types';
import ExecAPI from './execAPI';
import ExecMFAPI from './execMFAPI';
import ExecUserAPI from './execUserAPI';
import FakeExecAPI from './fakeExecAPI';
import FakeExecMFAPI from './fakeExecMFAPI';
import FakeExecUserAPI from './fakeExecUserAPI';

top.injectJsApi && top.injectJsApi(top, window);

class ApiService {
	apiInstance: ?API;
	apiConfig: ApiConfig;

	constructor (driver: ?string) {
		this.apiConfig = {
			driver: driver ?? 'exec'
		};
	}

	configureAPI (): API {
		if (this.apiConfig.driver === 'exec') {
			return new ExecAPI();
		} else if (this.apiConfig.driver === 'execMF') {
			return new ExecMFAPI();
		} else if (this.apiConfig.driver === 'userExec') {
			return new ExecUserAPI();
		} else {
			// Хак для вебпака
			if (process.env.NODE_ENV === 'development') {
				if (this.apiConfig.driver === 'exec-dev') {
					return new FakeExecAPI();
				} else if (this.apiConfig.driver === 'execMF-dev') {
					return new FakeExecMFAPI();
				} else if (this.apiConfig.driver === 'userExec-dev') {
					return new FakeExecUserAPI();
				}
			}
		}

		return new ExecAPI();
	}

	get instance () {
		if (!this.apiInstance) {
			this.apiInstance = this.configureAPI();
		}

		return this.apiInstance;
	}

	reconfigure (newConfig: ApiConfig) {
		this.apiConfig = newConfig;
		this.apiInstance = null;
	}
}

export default new ApiService(process.env.API_DRIVER);
