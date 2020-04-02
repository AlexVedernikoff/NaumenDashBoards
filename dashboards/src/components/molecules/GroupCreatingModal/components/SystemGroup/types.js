// @flow
import type {Group} from 'store/widgets/data/types';

type Option = {
	label: string,
	value: string
};

export type AttrSystemProps = {
	defaultValue: string,
	options: Array<Option>
};

export type State = {
	value: string,
};

export type Props = {
	...AttrSystemProps,
	className: string,
	group: Group,
	onSubmit: Group => void,
	show: boolean
};
