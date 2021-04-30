// @flow
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	className: string,
	onCallWidgetFilters: (dataSetIndex: number, filterIndex: number) => void,
	onClearWidgetFilters: () => void,
	widget: Widget
};

export type State = {
	showOptionsMenu: boolean,
};
