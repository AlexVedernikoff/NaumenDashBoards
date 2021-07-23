// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {CurrentObjectData, Item, ItemsMap} from 'store/sources/currentObject/types';
import type {OrCondition} from 'GroupModal/types';
import type {ThunkAction} from 'src/store/types';

export type ConnectedProps = {
	currentObjectData: CurrentObjectData,
};

export type ConnectedFunctions = {
	fetchCurrentObjectAttributes: (parent: Item | null, attribute: Attribute) => ThunkAction
};

type CurrentObjectOrCondition = {
	data: Attribute,
	type: string
};

export type Props = ConnectedProps & ConnectedFunctions & {
	attribute: Attribute,
	onChange: CurrentObjectOrCondition => void,
	value: OrCondition | CurrentObjectOrCondition
};

export type State = {
	options: ItemsMap
};
