// @flow
import {ELEMENT_TYPES, TEXT_TYPES} from './constants';

export type TextElementType = $Keys<typeof ELEMENT_TYPES>;

export type TextType = $Keys<typeof TEXT_TYPES>;

export type Props = {
	children: React$Node,
	className: string,
	elementType: TextElementType,
	type: TextType;
};
