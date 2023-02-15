// @flow
import type {AxisFormat} from 'store/widgets/data/types';

export type Props = {
	label?: string,
	onChange: (value: AxisFormat, callback?: Function) => void,
	title?: string,
	value: ?AxisFormat
};
