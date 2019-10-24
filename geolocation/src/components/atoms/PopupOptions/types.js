// @flow
import type {Option} from 'types/option';

type OwnProps = {
	options: Array<Option>
};

export type ConnectedProps = {
	toggleShadow: (name: 'actionsShadow' | 'headerShadow', any) => any
};

export type Props = OwnProps & ConnectedProps;

export type State = {};
