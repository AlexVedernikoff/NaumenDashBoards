// @flow
import type {AttrSetConditions} from 'store/widgetForms/types';
import type {Attribute} from 'WidgetFormPanel/components/AttributeFieldset/types';
import type {Props as ContainerProps} from 'containers/AttributeRefSelect/types';
import type {Props as SelectProps} from 'WidgetFormPanel/components/AttributeFieldset/components/AttributeSelect/types';

type ComponentProps = {
	attrSetConditions: ?AttrSetConditions,
	getOptions: (attributes: Array<Attribute>) => Array<Attribute>,
	onDrop: () => void,
	parent: Attribute | null
};

export type Props = SelectProps & ContainerProps & ComponentProps;
