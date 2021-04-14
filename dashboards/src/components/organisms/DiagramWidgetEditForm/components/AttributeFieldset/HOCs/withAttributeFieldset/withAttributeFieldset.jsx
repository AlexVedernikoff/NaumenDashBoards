// @flow
import type {Context} from './types';
import React, {createContext} from 'react';

export const ATTRIBUTE_FIELDSET_CONTEXT = createContext<Context>({
	dataKey: '',
	dataSetIndex: 0,
	source: {
		descriptor: '',
		value: null
	}
});

export const withAttributeFieldset = <Config: {} & Context>(Component: React$ComponentType<Config>): React$ComponentType<Config> => {
	return class WrappedComponent extends React.Component<Config> {
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
