// @flow
import type {FrameAPI} from 'api/interfaces';

export default class Frame implements FrameAPI {
	getContentCode () {
		return process.env.CONTENT_CODE ?? '';
	}
	async getCurrentContentParameters () {
		const result = await ({
			MinTimeIntervalUpdate: 3,
			editable: true
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
}
