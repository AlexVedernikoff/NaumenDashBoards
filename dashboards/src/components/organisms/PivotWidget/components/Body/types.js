// @flow
import type {DrillDownAction} from 'components/organisms/PivotWidget/types';
import type {PivotBodySettings} from 'src/store/widgets/data/types';
import type {PivotColumn, PivotSeriesData} from 'utils/recharts/types';
import type {PivotFormatter} from 'utils/recharts/formater/types';

export type Props = {
	columns: Array<PivotColumn>,
	columnsWidth: Array<number>,
	data: PivotSeriesData,
	drillDown: DrillDownAction,
	formatters: PivotFormatter,
	showTotal: boolean,
	style: PivotBodySettings
};
