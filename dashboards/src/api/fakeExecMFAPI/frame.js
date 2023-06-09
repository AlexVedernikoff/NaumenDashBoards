// @flow
import type {DTOValue, FilterFormContextDTO, FilterFormOptionsDTO} from 'api/types';
import {DASHBOARD_EDIT_MODE} from './constants';
import type {FrameAPI} from 'api/interfaces';

export default class Frame implements FrameAPI {
	getApplicationCode () {
		return process.env.CONTENT_CODE ?? '';
	}

	getContentCode () {
		return process.env.CONTENT_CODE ?? '';
	}

	async getCurrentContentParameters () {
		const result = await ({
			MinTimeIntervalUpdate: 3,
			editable: [process.env.EDITABLE_MODE ?? DASHBOARD_EDIT_MODE.EDIT]

		});
		return result;
	}

	async getCurrentContextObject () {
		const result = await ({
			UUID: process.env.SUBJECT_UUID ?? '',
			card_caption: 'Сотрудник "Петров Петр Петрович"',
			dashboardCode: process.env.CONTENT_CODE ?? '',
			metaClass: process.env.CONTEXT_OBJECT_META_CLASS ?? ''

		});
		return result;
	}

	getCurrentLocale () {
		if (!process.env.USER_LANG) {
			let lang = navigator.language;

			if (navigator.languages) {
				lang = navigator.languages[0];
			}

			return lang?.split('-', 2)[0] ?? 'ru';
		}

		return process.env.USER_LANG;
	}

	getCurrentUser () {
		return {
			admin: true,
			licensed: true,
			login: process.env.USER_LOGIN ?? '',
			roles: ['ROLE_SUPERUSER', 'ROLE_ADMIN', 'ROLE_OPERATOR'],
			title: process.env.USER_LOGIN ?? '',
			uuid: process.env.USER_UUID ?? ''
		};
	}

	getSubjectUuid () {
		return process.env.SUBJECT_UUID ?? '';
	}

	async openFilterForm (descriptor: FilterFormContextDTO, options: FilterFormOptionsDTO) {
		const {clazz} = descriptor;
		let result = {
			command: 'filterForm',
			serializedContext: JSON.stringify({
				cardObjectUuid: process.env.CONTEXT_OBJECT_META_CLASS,
				clazz,
				contentType: 'ObjectList'
			})
		};

		if (clazz === 'serviceCall') {
			result = {
				command: 'filterForm',
				serializedContext: JSON.stringify({
					cardObjectUuid: process.env.CONTEXT_OBJECT_META_CLASS,
					clazz,
					contentType: 'ObjectList',
					filters: [
						[
							{
								dtObjectWrapper: {
									fqn: 'catalogs$route',
									title: '1C СОУ: регистрация пользователей, настройка прав доступа 1С',
									uuid: 'catalogs$1828171'
								},
								properties: {
									attrTypeCode: 'object',
									attributeFqn: 'serviceCall@route',
									conditionCode: 'contains',
									isAttributeOfRelatedObject: 'false',
									isLinkToParent: 'false',
									isWithSemantic: 'true'
								}
							}
						]
					]
				})
			};
		}

		const awaitResult = await result;

		return awaitResult;
	}

	closeFilterForm () { }

	getViewMode () {
		return 'fullScreen';
	}

	restCallAsJson (url: string, options: DTOValue): Promise<DTOValue> {
		throw new Error('Fake api cannot use restCallModule');
	}

	restCallModule (module: string, method, ...params: Array<DTOValue>) {
		throw new Error('Fake api cannot use restCallModule');
	}
}
