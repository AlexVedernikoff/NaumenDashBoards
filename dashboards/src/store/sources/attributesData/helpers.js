// @flow
import type {AttributesDataMap, ReceivePayload} from './types';

const createAttributeData = () => ({
	data: [],
	error: false,
	loading: true,
	uploaded: false
});

const requestData = (map: AttributesDataMap, payload: string) => {
	map[payload] = map[payload] ? {...map[payload], error: false, loading: true} : createAttributeData();
};

const receiveData = (map: AttributesDataMap, payload: ReceivePayload, uploaded: boolean = false) => {
	const {data, key} = payload;
	map[key] = {
		...map[key],
		data: [...map[key].data, ...data],
		loading: false,
		uploaded
	};
};

const recordError = (map: AttributesDataMap, payload: string) => {
	map[payload] = {
		...map[payload],
		error: true,
		loading: false
	};
};

const setUploaded = (map: AttributesDataMap, payload: string) => {
	map[payload] = {
		...map[payload],
		loading: false,
		uploaded: true
	};
};

export {
	receiveData,
	recordError,
	requestData,
	setUploaded
};
