// @flow
import type {InitParams, ObjectType} from './types';

export const getInitParams = async (): Promise<InitParams | null> => {
	if (window.jsApi.forms) {
		const data: ObjectType = await window.jsApi.forms.getValues();
		const subjectId: string = window.jsApi.extractSubjectUuid();
		const {metaClass} = data;

		return {
			metaClass,
			subjectId
		};
	}
	return null;
};
