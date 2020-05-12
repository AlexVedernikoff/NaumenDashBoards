// @flow
import type {Attribute} from 'store/sources/attributes/types';
import type {OnChangeAttributeLabelEvent, OnSelectAttributeEvent} from 'WidgetFormPanel/types';
import type {Props as SelectProps} from 'components/molecules/TransparentSelect/types';

export type Props = {
	...SelectProps,
	onChangeLabel: OnChangeAttributeLabelEvent => void,
	onSelect: OnSelectAttributeEvent => void,
	parent: Attribute | null
};
