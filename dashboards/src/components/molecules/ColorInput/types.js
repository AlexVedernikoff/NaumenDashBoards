// @flow
import type {OnChangeEvent} from 'components/types';
import type {Props as ValueProps} from './components/Value/types';

export type Components = {
	Value: React$ComponentType<ValueProps>
};

export type Props = {
	className: string,
	components: $Shape<Components>,
	name: string,
	onChange: OnChangeEvent<string> => void,
	portable: boolean,
	value: string
};

export type State = {
	showPicker: boolean
};
