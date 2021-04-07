// @flow
import type {AxisSettings} from 'store/widgets/data/types';

export type Props = {
	children: React$Node,
	name: string,
	onChange: (name: string, value: AxisSettings) => void,
	title: string,
	value: AxisSettings
};
