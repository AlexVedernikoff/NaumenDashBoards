// @flow
import type {Options} from 'utils/chart/types';
import type {SpeedometerWidget} from 'store/widgets/data/types';

export type SpeedometerData = {
	title: string,
	total: number
};

export type Props = {
	widget: SpeedometerWidget
};

export type State = {
	options: Options
};
