// @flow
import type {Attribute} from 'WidgetFormPanel/components/AttributeFieldset/types';
import type {Components, Props as SelectProps} from 'WidgetFormPanel/components/AttributeFieldset/components/AttributeSelect/types';
import type {Props as ContainerProps} from 'containers/AttributeMainSelect/types';
import type {Source} from 'store/widgets/data/types';

export type Props = {
	components: Components,
	dataSetIndex: number,
	getOptions: (attribute: Array<Attribute>) => Array<Attribute>,
	parentClassFqn: string | null,
	source: Source | null,
} & ContainerProps & SelectProps;
