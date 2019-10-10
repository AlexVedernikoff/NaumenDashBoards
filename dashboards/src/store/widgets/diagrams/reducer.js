// @flow
import {defaultAction, initialDiagramsState} from './init';
import type {DiagramsAction, DiagramsState} from './types';
import {DIAGRAMS_EVENTS} from './constants';
import {resetData, setDiagram, setDiagramError, setRequestDiagram} from './helpers';
import {WIDGETS_EVENTS} from 'store/widgets/data/constants';

const reducer = (state: DiagramsState = initialDiagramsState, action: DiagramsAction = defaultAction): DiagramsState => {
	switch (action.type) {
		case DIAGRAMS_EVENTS.REQUEST_DIAGRAM:
			return setRequestDiagram(state, action);
		case DIAGRAMS_EVENTS.RECEIVE_DIAGRAM:
			return setDiagram(state, action);
		case DIAGRAMS_EVENTS.RECORD_DIAGRAM_ERROR:
			return setDiagramError(state, action);
		case WIDGETS_EVENTS.UPDATE_WIDGET:
		case WIDGETS_EVENTS.SET_CREATED_WIDGET:
			return resetData(state, action);
		default:
			return state;
	}
};

export default reducer;
