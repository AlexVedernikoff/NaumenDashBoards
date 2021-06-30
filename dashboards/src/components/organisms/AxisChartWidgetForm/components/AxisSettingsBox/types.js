// @flow
import type {AxisSettings} from 'store/widgets/data/types';

export type Props = {
	name: string,
	onChange: (name: string, value: AxisSettings) => void,
	renderAxisFormat?: (() => React$Node),
	renderNameField?: (() => React$Node),
	title: string,
	value: AxisSettings
};
