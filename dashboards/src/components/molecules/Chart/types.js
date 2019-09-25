// @flow
import type {ApexOptions} from 'apexcharts';
import type {Chart} from 'store/widgets/charts/types';
import type {Widget} from 'store/widgets/data/types';

export type Props = {
	data?: Chart,
	widget: Widget
};

export type State = {
	options: ApexOptions,
	series: []
};
