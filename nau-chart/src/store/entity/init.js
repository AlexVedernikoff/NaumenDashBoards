// @flow
import type {EntityState} from './types';
import {VERIFY_EVENTS} from './constants';

export const initialVerifyState: EntityState = {
	activeElement: null,
	centerPointUuid: null,
	data: [],
	dataDefaultLocationPoints: [],
	dataDefaultView: null,
	editingGlobal: false,
	error: false,
	exportTo: null,
	listViews: {
		generalViews: {
			viewData: []
		},
		personalView: {
			defaultSchemaKey: '',
			viewData: []
		}
	},
	loading: false,
	position: {x: 0, y: 0},
	scale: 1,
	searchObjects: [],
	searchText: '',
	setting: {
		popupSaveViews: false,
		popupSettingViews: false
	}
};

export const defaultVerifyAction = {
	payload: null,
	type: VERIFY_EVENTS.EMPTY_DATA
};
