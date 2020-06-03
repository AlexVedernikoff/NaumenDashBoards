// @flow
import type {OnChangeInputEvent} from 'components/types';
import type {Props as InputProps} from './components/Input/types';

export type Components = $Shape<{
	Input: React$ComponentType<InputProps>
}>;

export type Props = {
	className: string,
	components: Components,
	name: string,
	onChange: OnChangeInputEvent => void,
	portable: boolean,
	value: string
};

export type State = {
	showPicker: boolean
};
