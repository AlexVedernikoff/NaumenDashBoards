// @flow
import type {Context} from 'DiagramWidgetEditForm/components/AttributeFieldset/HOCs/withAttributeFieldset/types';
import type {Props as ContainerProps} from 'containers/DiagramWidgetEditForm/components/MainSelectList/types';
import type {Props as ListProps} from 'components/molecules/Select/components/List/types';

export type Props = ContainerProps & ListProps & Context;

export type State = {
	showDynamicAttributes: boolean,
	showDynamicAttributesError: boolean
};
