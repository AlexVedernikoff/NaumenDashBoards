// @flow
import type {ComparePeriod} from 'store/widgets/data/types';
import type {OnChange} from 'components/organisms/SummaryWidgetForm/types';

export type Props = {
	name: string,
	onChange: OnChange,
	value: ComparePeriod,
};
