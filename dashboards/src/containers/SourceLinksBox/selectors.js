// @flow
import type {AppState} from 'store/types';
import type {ConnectedProps} from './types';
import type {Props as ComponentProps} from 'PivotWidgetForm/components/SourceLinksBox/types';

export const props = (state: AppState, props: ComponentProps): ConnectedProps => ({
	position: state.dashboard.settings.editPanelPosition
});
