// @flow
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	className: string,
	onChange: (dataSetIndex: number, filterIndex: number, newDescriptor: string) => void,
	onClear: () => void,
	widget: Widget
};

export type State = {
	showOptionsMenu: boolean,
	usedFilters: boolean
};

export type MenuItemOption = {
	dataSetIndex: number,
	dataSetLabel: string,
	filterIndex: number,
	isMultipleSource: boolean,
	label: string,
	used: boolean
};
