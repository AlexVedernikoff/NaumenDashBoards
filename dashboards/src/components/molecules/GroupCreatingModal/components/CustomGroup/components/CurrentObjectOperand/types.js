// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {Item, TypeData} from 'store/sources/currentObject/types';
import type {SelectOperand} from 'store/customGroups/types';
import {ThunkAction} from 'redux-thunk';

export type Props = {
	attribute: Attribute,
	data: TypeData,
	fetch: (item: Item | null, attribute: Attribute) => ThunkAction,
	onChange: SelectOperand => void,
	operand: SelectOperand
};
