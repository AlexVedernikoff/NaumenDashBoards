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
		config.url = `${config.url}&accessKey=afa59bf6-ce2f-40d9-b3cf-9126c450ad16`;
		config.withCredentials = true;
		return config;
	};

	client.interceptors.request.use(handleConfig);
}

export default client;
