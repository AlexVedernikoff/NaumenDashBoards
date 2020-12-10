// @flow
import type {DataTopSettings} from 'store/widgets/data/types';

export type Props = {
	disabled: boolean,
	error: string,
	onChange: DataTopSettings => void,
	value: DataTopSettings
};
