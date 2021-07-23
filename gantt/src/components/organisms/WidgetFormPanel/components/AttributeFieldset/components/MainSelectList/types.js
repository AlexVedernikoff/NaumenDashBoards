// @flow
import type {Context} from 'WidgetFormPanel/components/AttributeFieldset/HOCs/withAttributeFieldset/types';
import type {Props as ContainerProps} from 'containers/AttributeMainSelectList/types';
import type {Props as ListProps} from 'components/molecules/Select/components/List/types';

export type Props = Context & ContainerProps & ListProps;

export type State = {
	showDynamicAttributes: boolean,
	showDynamicAttributesError: boolean
};
