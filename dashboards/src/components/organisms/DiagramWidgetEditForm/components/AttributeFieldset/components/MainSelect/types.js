// @flow
import type {Props as SelectProps} from 'DiagramWidgetEditForm/components/AttributeFieldset/components/AttributeSelect/types';
import type {Source} from 'store/widgets/data/types';

export type Props = {
	source: Source | null,
} & SelectProps;
