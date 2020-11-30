// @flow
import type {InitParams, ObjectType} from './types';
import {CALENDAR_VIEW_TYPES} from 'constants/index';

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

export const getInitView = (hideWeekend: boolean, defaultView: string) => {
	const viewName = CALENDAR_VIEW_TYPES[defaultView];

	if (viewName === 'week') {
		return hideWeekend ? 'work-week' : 'week';
	}

	return viewName;
};
