// @flow
import type {ConnectedProps, Option, OwnProps} from 'containers/WidgetKebab/types';
import type {DivRef} from 'components/types';
import {FILE_VARIANTS} from 'utils/export';

export type ComponentFunctions = {
	onChangeFiltersOnWidget: (filter: Option) => Promise<void>,
	onChangeMode: (selectedMode: Option) => void,
	onDrillDown: (selectedSource: Option) => void,
	onExport: (element: HTMLDivElement, format: $Keys<typeof FILE_VARIANTS>) => void,
	onNavigation: () =>void,
	onRemove: (ref?: DivRef) => void,
	onSelect: () => void
};

export type Props = ComponentFunctions & ConnectedProps & OwnProps;
