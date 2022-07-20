// @flow
import type {DTOValue, FilterFormContextDTO, FilterFormOptionsDTO} from 'api/types';
import type {FrameAPI} from 'api/interfaces';

export default class Frame implements FrameAPI {
	getApplicationCode () {
		return window.jsApi?.findApplicationCode?.() ?? '';
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
		return window.jsApi?.getCurrentLocale?.() ?? 'client';
	}

	getCurrentUser () {
		return window.jsApi.getCurrentUser();
	}

	getSubjectUuid () {
		return window.jsApi.extractSubjectUuid();
	}

	getViewMode () {
		return window.jsApi.getViewMode?.() ?? null;
	}

	restCallAsJson (url: string, options: DTOValue) {
		return window.jsApi.restCallAsJson(url, options);
	}

	restCallModule (module: string, method, ...params: Array<DTOValue>) {
		return window.jsApi.restCallModule(module, method, ...params);
	}

	openFilterForm (context: FilterFormContextDTO, options: FilterFormOptionsDTO) {
		if (window.jsApi.forms.getFilterFormBuilder) {
			let formBuilder = window.jsApi.forms.getFilterFormBuilder(context);

			if (options.useRestriction) {
				if (options.restriction) {
					formBuilder = formBuilder.setAttributeTree({'restriction': options.restriction});
				} else {
					formBuilder = formBuilder.setAttributeList({'useRestriction': true});
				}
			}

			return formBuilder.openForm();
		} else {
			return window.jsApi.commands.filterForm(context, options.useRestriction);
		}
	}
}
