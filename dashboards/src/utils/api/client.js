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
		config.url = `${config.url}&accessKey=8b78f934-5f8a-4e54-b3d6-08b013cb4297`;
		config.withCredentials = true;
		return config;
	};

	client.interceptors.request.use(handleConfig);
}

export default client;
