// @flow
import type {AppState} from 'store/types';
import {cancelForm, createWidget, saveWidget} from 'store/widgets/data/actions';
import type {ConnectedFunctions, ConnectedProps} from './types';
import {createToast} from 'store/toasts/actions';
import {fetchAttributes} from 'store/sources/attributes/actions';
import {fetchRefAttributes} from 'store/sources/refAttributes/actions';
import {NewWidget} from 'utils/widget';

export const props = (state: AppState): ConnectedProps => {
	const {context, sources, widgets} = state;
	const {data} = widgets;
	const {newWidget, selectedWidget} = data;
	const {contentCode, subjectUuid, user} = context;
	const contentContext = {contentCode, subjectUuid};
	const widget = selectedWidget === NewWidget.id && newWidget ? newWidget : data.map[selectedWidget];

	return {
		attributes: sources.attributes.map,
		context: contentContext,
		refAttributes: sources.refAttributes,
		saveError: data.saveError,
		sources: sources.data.map,
		updating: data.updating,
		user,
		widget
	};
};

export const functions: ConnectedFunctions = {
	cancelForm,
	createToast,
	createWidget,
	fetchAttributes,
	fetchRefAttributes,
	saveWidget
};
