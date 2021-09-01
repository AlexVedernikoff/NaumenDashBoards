// @flow
import type {Props as ComponentProps} from 'components/organisms/GroupModal/types';

export type ConnectedProps = {
    isUserMode: boolean
};

export type Props = ConnectedProps & ComponentProps;
