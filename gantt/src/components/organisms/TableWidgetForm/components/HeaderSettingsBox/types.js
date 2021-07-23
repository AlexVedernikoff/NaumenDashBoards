// @flow
import type {TableHeaderSettings} from 'src/store/widgets/data/types';

export type Props = {
	onChange: TableHeaderSettings => void,
	value: TableHeaderSettings
};
