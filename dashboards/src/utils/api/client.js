// @flow
import axios from 'axios';
import type {AxiosRequestConfig} from 'axios';

const client = axios.create({
	headers: {
		'Accept-Language': 'ru-RU'
	}
});

if (process.env.NODE_ENV === 'development') {
	const handleConfig = (config: AxiosRequestConfig) => {
		config.url = `${config.url}&accessKey=2ad485a2-d0e5-46bb-bc48-298b6143f151`;
		config.withCredentials = true;
		return config;
	};

	client.interceptors.request.use(handleConfig);
}

export default client;
