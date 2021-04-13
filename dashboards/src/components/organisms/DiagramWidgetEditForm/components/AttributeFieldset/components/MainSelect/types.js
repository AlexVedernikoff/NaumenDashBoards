// @flow
import type {Attribute} from 'DiagramWidgetEditForm/components/AttributeFieldset/types';
import type {Components, Props as SelectProps} from 'DiagramWidgetEditForm/components/AttributeFieldset/components/AttributeSelect/types';
import type {InjectedProps} from 'components/HOCs/withGetComponents/types';
import type {Props as ContainerProps} from 'containers/DiagramWidgetEditForm/components/MainSelect/types';
import type {Source} from 'store/widgets/data/types';

export type Props = {
	components: Components,
	dataSetIndex: number,
	getOptions: (attribute: Array<Attribute>) => Array<Attribute>,
	parentSource: string,
	source: Source | null,
} & InjectedProps & ContainerProps & SelectProps;
