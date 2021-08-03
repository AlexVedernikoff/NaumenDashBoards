// @flow
import type {DTOValue} from 'api/types';
import fakeExecMFFrame from 'api/fakeExecMFAPI/frame';

export default class Frame extends fakeExecMFFrame {
	restCallAsJson (url: string, options: DTOValue) {
		const faleUrl = `/sd/services/earest/${url}&accessKey=${process.env.ACCESS_KEY ?? ''}`;
		const {headers = {}} = options;
		const newHeaders = {...headers, 'Content-Type': 'application/json'};
		return fetch(faleUrl, {...options, headers: newHeaders});
	}
}
