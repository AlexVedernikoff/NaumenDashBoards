// @flow
import type {SpeedometerWidget} from 'store/widgets/data/types';

export type SpeedometerData = {
	title: string,
	total: number
};

export type Props = {
	widget: SpeedometerWidget
};
