// @flow
import type {ContextProps} from 'containers/DiagramWidgetEditForm/components/AttributeFieldSet/types';
import type {Props as ContainerProps} from 'containers/DiagramWidgetEditForm/components/AttributeFieldSet/components/MainSelectList/types';
import type {Props as ListProps} from 'components/molecules/Select/components/List/types';

export type Props = ContainerProps & ContextProps & ListProps;

export type State = {
	showDynamicAttributes: boolean,
	showDynamicAttributesError: boolean
};
