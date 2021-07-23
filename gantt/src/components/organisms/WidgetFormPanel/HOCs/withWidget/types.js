// @flow
import type {AnyWidget} from 'store/widgets/data/types';
import NewWidget from 'store/widgets/data/NewWidget';

export type InjectedProps = {
	widget: AnyWidget | NewWidget
};
