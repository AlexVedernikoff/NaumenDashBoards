// @flow
import type {AttrSetConditions} from 'utils/descriptorUtils/types';
import type {Attribute} from 'WidgetFormPanel/components/AttributeFieldset/types';
import type {Components, Props as SelectProps} from 'WidgetFormPanel/components/AttributeFieldset/components/AttributeSelect/types';
import type {DynamicAttributesMode} from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withShowDynamicAttributes/types';
import type {Props as ContainerProps} from 'containers/AttributeMainSelect/types';
import type {Source} from 'store/widgets/data/types';

export type OwnProps = {
	attrSetConditions: ?AttrSetConditions,
	components: Components,
	dataSetIndex: number,
	getOptions: (attribute: Array<Attribute>) => Array<Attribute>,
	parentClassFqn: ?string,
	source: ?Source,
};

export type Props = OwnProps & ContainerProps & SelectProps;

export type State = {
	dynamicAttributesMode: DynamicAttributesMode
};
