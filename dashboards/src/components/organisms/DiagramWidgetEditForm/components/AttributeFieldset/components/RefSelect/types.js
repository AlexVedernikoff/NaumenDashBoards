// @flow
import type {Attribute} from 'DiagramWidgetEditForm/components/AttributeFieldset/types';
import type {Props as ContainerProps} from 'containers/DiagramWidgetEditForm/components/RefSelect/types';
import type {Props as SelectProps} from 'DiagramWidgetEditForm/components/AttributeFieldset/components/AttributeSelect/types';

type ComponentProps = {
	getOptions: (attributes: Array<Attribute>) => Array<Attribute>,
	onDrop: () => void,
	parent: Attribute | null
};

export type Props = SelectProps & ContainerProps & ComponentProps;
