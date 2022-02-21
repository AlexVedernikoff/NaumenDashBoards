// @flow
import type {Indicator, SourceData} from 'store/widgetForms/types';

export type FormBoxProps = {
	children: React$Node,
	rightControl: React$Node,
	title: string
};

export type Components = {
	FormBox: React$ComponentType<FormBoxProps>
};

export type Props = {
	canAddIndicator: boolean,
	components: Components,
	dataKey: string,
	index: number,
	onChange: (index: number, value: Array<Indicator>, callback?: Function) => void,
	source: SourceData,
	value: Array<Indicator>
};
