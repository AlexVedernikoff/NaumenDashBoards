// @flow
import type {Components, InjectedProps} from './types';
import React from 'react';

export const withGetComponents = <Config: Object>(Component: React$ComponentType<Config>): React$ComponentType<Config & InjectedProps> => {
	return class WrappedComponent extends React.Component<Config> {
		components = null;

		getComponents = (components: Components) => {
			if (!this.components) {
				this.components = components;
			}

			return this.components;
		};

		render () {
			return <Component {...this.props} getComponents={this.getComponents} />;
		}
	};
};

export default withGetComponents;
