// @flow
import type {AppState} from './types';

export const initialState: AppState = {
	defaultView: '{week=Неделя}',
	error: null,
	hideWeekend: true,
	isLoading: true,
	metaClass: null,
	subjectId: null
};
