// @flow
import type {Components, Option, OrCondition} from 'GroupModal/types';
import type {LangType} from 'localization/localize_types';

export type Props = {
	components: Components,
	disabled: boolean,
	index: number,
	isLast: boolean,
	onCreate?: () => void,
	onRemove: (index: number) => void,
	onUpdate: (index: number, condition: OrCondition) => void,
	options: Array<Option>,
	validationPath: string,
	value: OrCondition
};

export type State = {
	value: {
		label: LangType,
		value: string
	}
};
