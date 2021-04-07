// @flow
import {HELPERS_CONTEXT} from './constants';
import type {InjectedProps} from './types';
import React from 'react';

export const withHelpers = <Props: {} & InjectedProps>(Component: React$ComponentType<Props>): React$ComponentType<Props> => {
	return class WrappedComponent extends React.Component<Props> {
		render () {
			return (
				<HELPERS_CONTEXT.Consumer>
					{context => <Component {...this.props} helpers={context} />}
				</HELPERS_CONTEXT.Consumer>
			);
		}
	};
};

export default withHelpers;
