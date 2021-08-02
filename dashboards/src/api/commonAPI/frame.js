// @flow
import type {DTOValue, FilterFormDescriptorDTO} from 'api/types';
import type {FrameAPI} from 'api/interfaces';

export default class Frame implements FrameAPI {
	getContentCode () {
		return window.jsApi.findContentCode();
	}

	getCurrentContentParameters () {
		return window.jsApi.commands.getCurrentContentParameters();
	}

	getCurrentContextObject () {
		return window.jsApi.commands.getCurrentContextObject();
	}

	getCurrentUser () {
		return window.jsApi.getCurrentUser();
	}

	getSubjectUuid () {
		return window.jsApi.extractSubjectUuid();
	}

	restCallModule (module: string, method, ...params: Array<DTOValue>) {
		return window.jsApi.restCallModule(module, method, ...params);
	}
}
