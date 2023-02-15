// @flow
import type {DataTopSettings} from 'store/widgets/data/types';

export type Props = {
	disabled: boolean,
	hasModeOfTop: boolean,
	onChange: DataTopSettings => void,
	value: DataTopSettings
};
