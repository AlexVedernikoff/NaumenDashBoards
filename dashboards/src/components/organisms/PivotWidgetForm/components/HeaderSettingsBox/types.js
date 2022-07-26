// @flow
import type {PivotHeaderSettings} from 'src/store/widgets/data/types';

export type Props = {
	onChange: PivotHeaderSettings => void,
	value: PivotHeaderSettings
};
