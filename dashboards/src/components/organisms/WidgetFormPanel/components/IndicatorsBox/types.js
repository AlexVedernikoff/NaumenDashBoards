// @flow
import type {AxisFormat} from 'store/widgets/data/types';
import type {Indicator, SourceData} from 'store/widgetForms/types';

export type FormBoxProps = {
	children: React$Node,
	title: string
};

export type Components = {
	FormBox: React$ComponentType<FormBoxProps>
};

export type Props = {
	components: Components,
	dataKey: string,
	index: number,
	onChange: (index: number, value: Array<Indicator>, callback?: Function) => void,
	onResetIndicatorFormat?: (index: number, value: AxisFormat) => void,
	source: SourceData,
	value: Array<Indicator>
};
