// @flow
import type {StyleBuilderProps} from 'WidgetFormPanel/builders/StyleFormBuilder/types';
import type {Table} from 'store/widgets/data/types';

export type OnChangeEvent = {
	name: string,
	value: any
};

export type Props = {
	...StyleBuilderProps,
	data: Table,
	name: string,
	onChange: (name: string, data: Table) => void
};
