// @flow
import type {Group} from 'store/widgets/data/types';
import type {SetSubmit} from 'components/molecules/GroupCreatingModal/types';

type Option = {
	label: string,
	value: string
};

export type AttrSystemProps = {|
	defaultValue: string,
	options: Array<Option>
|};

export type State = {
	value: string,
};

export type Props = {
	...AttrSystemProps,
	className: string,
	group: Group,
	onSelect?: (value: string) => void,
	onSubmit: Group => void,
	setSubmit: SetSubmit,
	show: boolean
};
