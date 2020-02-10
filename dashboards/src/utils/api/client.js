// @flow
import axios from 'axios';
import type {AxiosRequestConfig} from 'axios';

const client = axios.create({
	headers: {
		'Accept-Language': 'ru-RU'
	},
	timeout: 8000
});

if (process.env.NODE_ENV === 'development') {
	const handleConfig = (config: AxiosRequestConfig) => {
		config.url = `${config.url}&accessKey=039e384c-eb64-446c-a7db-38ddce6b239e`;
		config.withCredentials = true;
		return config;
	};

	client.interceptors.request.use(handleConfig);
}

export default client;
