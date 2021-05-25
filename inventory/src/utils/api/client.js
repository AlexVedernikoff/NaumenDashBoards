// @flow
import axios from 'axios';
import type {AxiosRequestConfig} from 'axios';
import {KEY} from './constants';

const client = axios.create();

if (process.env.NODE_ENV === 'development') {
	const handleConfig = (config: AxiosRequestConfig) => {
		config.url = `${config.url}&accessKey=${KEY}`;
		config.withCredentials = true;
		return config;
	};

	client.interceptors.request.use(handleConfig);
}

export default client;
