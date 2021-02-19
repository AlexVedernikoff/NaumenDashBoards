// @flow
import type {AxisSettings} from 'store/widgets/data/types';
import type {OnChangeInputEvent} from 'components/types';

export type Props = {
	axisFieldName: string,
	axisName: string,
	name: string,
	onChangeAxisName: (event: OnChangeInputEvent) => void,
	onChangeSettings: (name: string, settings: AxisSettings) => void,
	settings: AxisSettings,
};
