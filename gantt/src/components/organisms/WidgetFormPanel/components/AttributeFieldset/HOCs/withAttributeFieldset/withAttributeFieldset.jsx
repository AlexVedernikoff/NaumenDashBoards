// @flow
import {ATTRIBUTE_FIELDSET_CONTEXT} from './constants';
import type {Context} from './types';
import React from 'react';

export const withAttributeFieldset = <Config: {} & Context>(Component: React$ComponentType<Config>): React$ComponentType<Config> => {
	return class WithAttributeFieldset extends React.Component<Config> {
		renderComponent = (context: Context) => {
			return <Component {...this.props} {...context} />;
		};

		render () {
			return (
				<ATTRIBUTE_FIELDSET_CONTEXT.Consumer>
					{context => this.renderComponent(context)}
				</ATTRIBUTE_FIELDSET_CONTEXT.Consumer>
			);
		}
	};
};

export default withAttributeFieldset;
