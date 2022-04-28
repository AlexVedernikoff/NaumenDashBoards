// @flow
import type {Option} from 'types/option';

type OwnProps = {};

export type ConnectedProps = {
	option: Option
};

export type Props = OwnProps & ConnectedProps;
