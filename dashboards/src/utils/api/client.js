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
		config.url = `${config.url}&accessKey=c76592eb-7b91-4ec7-9403-6197672f9b05`;
		config.withCredentials = true;
		return config;
	};

	client.interceptors.request.use(handleConfig);
}

export default client;
