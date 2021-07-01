// @flow
import type {OwnProps} from './types';

const props = (props: OwnProps) => {
	const {disabled, icon, nameButton, onClick} = props;

	return {
		disabled,
		icon,
		nameButton,
		onClick
	}
};

export {
	props
};
