// @flow
import type {DTOValue, FilterFormDescriptorDTO} from 'api/types';
import type {FrameAPI} from 'api/interfaces';

export default class Frame implements FrameAPI {
	getApplicationCode () {
		return window.jsApi.findApplicationCode();
	}

	getContentCode () {
		return window.jsApi.findContentCode();
	}

	getCurrentContentParameters () {
		return window.jsApi.commands.getCurrentContentParameters();
	}

	getCurrentContextObject () {
		return window.jsApi.commands.getCurrentContextObject();
	}

	getCurrentLocale () {
		return window.jsApi.commands.getCurrentLocale();
	}

	getCurrentUser () {
		return window.jsApi.getCurrentUser();
	}

	getSubjectUuid () {
		return window.jsApi.extractSubjectUuid();
	}

	restCallAsJson (url: string, options: DTOValue) {
		return window.jsApi.restCallAsJson(url, options);
	}

	restCallModule (module: string, method, ...params: Array<DTOValue>) {
		return window.jsApi.restCallModule(module, method, ...params);
	}

	openFilterForm (descriptor: FilterFormDescriptorDTO, useAttrFilter?: boolean) {
		return window.jsApi.commands.filterForm(descriptor, useAttrFilter);
	}
}
