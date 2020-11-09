// @flow
import type {ChartSorting} from 'store/widgets/data/types';
import type {StyleBuilderProps} from 'DiagramWidgetEditForm/builders/StyleFormBuilder/types';

export type Props = {
	...StyleBuilderProps,
	circle: boolean,
	data: ChartSorting,
	name: string,
	onChange: (name: string, data: ChartSorting) => void
};
