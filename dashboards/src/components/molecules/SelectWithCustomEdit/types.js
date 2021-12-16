// @flow
import type {LangType} from 'localization/localize_types';
import type {SelectEvent} from 'components/molecules/Select/types';

export type DefaultProps = {
	clearing: boolean,
	customOptionsLabel: LangType,
	emptyAsNotUsed: boolean,
	name: string,
	placeholder: string,
};

export type Props = DefaultProps & {
	onSelect?: SelectEvent => void,
	options: string[],
	value: ?string,
};

export type State = {
	showForm: boolean
};
