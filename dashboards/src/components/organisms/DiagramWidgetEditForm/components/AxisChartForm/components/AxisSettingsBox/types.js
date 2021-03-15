// @flow
import type {AxisSettings} from 'store/widgets/data/types';
import type {OnChangeEvent} from 'components/types';

export type Props = {
	axisFieldName: string,
	axisName: string,
	name: string,
	onChangeAxisName: (event: OnChangeEvent<string>) => void,
	onChangeSettings: (name: string, settings: AxisSettings) => void,
	settings: AxisSettings,
	title: string
};
