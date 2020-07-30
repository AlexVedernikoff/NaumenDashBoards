// @flow
import type {AppState} from 'store/types';
import {cancelForm, createWidget, saveWidget} from 'store/widgets/data/actions';
import {changeLayoutMode} from 'store/dashboard/settings/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createToast} from 'store/toasts/actions';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchGroupDynamicAttributes} from 'store/sources/dynamicGroups/actions';
import {fetchRefAttributes} from 'store/sources/refAttributes/actions';
import {getMapValues} from 'src/helpers';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, sources, widgets} = state;
	const {layoutMode} = dashboard.settings;
	const {data} = widgets;
	const {map, selectedWidget} = data;
	const {contentCode, subjectUuid, user} = context;
	const {attributes, dynamicGroups} = sources;
	const contentContext = {contentCode, subjectUuid};
	const widget = data.map[selectedWidget];

	return {
		attributes,
		context: contentContext,
		dynamicGroups,
		layoutMode,
		refAttributes: sources.refAttributes,
		saveError: data.saveError,
		sources: sources.data.map,
		updating: data.updating,
		user,
		widget,
		widgets: getMapValues(map).filter(({id}) => id !== selectedWidget)
	};
};

export const functions: ConnectedFunctions = {
	cancelForm,
	changeLayoutMode,
	createToast,
	createWidget,
	fetchAttributes,
	fetchGroupDynamicAttributes,
	fetchRefAttributes,
	saveWidget
};
