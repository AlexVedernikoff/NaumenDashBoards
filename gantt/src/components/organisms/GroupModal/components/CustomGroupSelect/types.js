// @flow
import type {CustomGroup} from 'GroupModal/types';
import type {OnChangeEvent, OnSelectEvent} from 'components/types';

export type Props = {
	loading: boolean,
	onChangeName: (event: OnChangeEvent<string>) => void,
	onCreate: () => void,
	onFetch: () => void,
	onRemove: () => void,
	onSelect: (event: OnSelectEvent) => void,
	options: Array<CustomGroup>,
	value: CustomGroup | null
};
