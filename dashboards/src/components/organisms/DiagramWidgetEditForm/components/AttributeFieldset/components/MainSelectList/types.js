// @flow
import type {ContextProps} from 'containers/DiagramWidgetEditForm/components/AttributeFieldSet/types';
import type {ContextProps as ListProps} from 'components/molecules/Select/components/List/types';
import type {Props as ContainerProps} from 'containers/DiagramWidgetEditForm/components/MainSelectList/types';

export type Props = ContainerProps & ContextProps & ListProps;

export type State = {
	showDynamicAttributes: boolean,
	showDynamicAttributesError: boolean
};
