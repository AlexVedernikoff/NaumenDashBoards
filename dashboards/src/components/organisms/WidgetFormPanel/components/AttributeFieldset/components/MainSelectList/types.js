// @flow
import type {Context as AttributeFieldsetContext} from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withAttributeFieldset/types';
import type {
	Context as ShowDynamicAttributesContext,
	DynamicAttributesMode
} from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withShowDynamicAttributes/types';
import type {InjectedProps as AttributesHelpersContext} from 'containers/DiagramWidgetForm/HOCs/withAttributesHelpers/types';
import type {Props as ContainerProps} from 'containers/AttributeMainSelectList/types';
import type {Props as ListProps} from 'components/molecules/Select/components/List/types';

export type Props = AttributeFieldsetContext
	& ShowDynamicAttributesContext
	& ContainerProps
	& ListProps
	& AttributesHelpersContext
	& {
		setDynamicAttributesMode: (DynamicAttributesMode) => void,
	};
