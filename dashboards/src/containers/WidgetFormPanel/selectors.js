// @flow
import type {AppState} from 'store/types';
import {cancelForm, createWidget, saveWidget} from 'store/widgets/data/actions';
import {changeDisplayMode} from 'store/dashboard/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createToast} from 'store/toasts/actions';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchGroupDynamicAttributes} from 'store/sources/dynamicGroups/actions';
import {fetchRefAttributes} from 'store/sources/refAttributes/actions';
import {getMapValues} from 'src/helpers';
import {NewWidget} from 'utils/widget';

export const props = (state: AppState): ConnectedProps => {
	const {context, dashboard, sources, widgets} = state;
	const {layoutMode} = dashboard;
	const {data} = widgets;
	const {map, newWidget, selectedWidget} = data;
	const {contentCode, subjectUuid, user} = context;
	const {attributes, dynamicGroups} = sources;
	const contentContext = {contentCode, subjectUuid};
	const widget = selectedWidget === NewWidget.id && newWidget ? newWidget : data.map[selectedWidget];

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
	changeDisplayMode,
	createToast,
	createWidget,
	fetchAttributes,
	fetchGroupDynamicAttributes,
	fetchRefAttributes,
	saveWidget
};
