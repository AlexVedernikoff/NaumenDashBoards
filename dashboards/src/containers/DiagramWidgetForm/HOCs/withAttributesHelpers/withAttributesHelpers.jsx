// @flow
import {ATTRIBUTES_HELPERS_CONTEXT} from './constants';
import type {InjectedProps} from './types';
import React from 'react';

export const withAttributesHelpers = <Config: {} & InjectedProps>(Component: React$ComponentType<Config>): React$ComponentType<Config> =>
	class WithAttributesHelpers extends React.Component<Config> {
		render () {
			return (
				<ATTRIBUTES_HELPERS_CONTEXT.Consumer>
					{context => <Component {...this.props} attributesHelpers={context} />}
				</ATTRIBUTES_HELPERS_CONTEXT.Consumer>
			);
		}
	};

export default withAttributesHelpers;
