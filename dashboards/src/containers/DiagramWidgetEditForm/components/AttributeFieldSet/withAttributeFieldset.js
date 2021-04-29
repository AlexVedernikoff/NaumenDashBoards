// @flow
import type {ContextProps} from './types';
import React, {createContext} from 'react';

export const AttributeFieldsetContext: React$Context<ContextProps> = createContext({
	dataKey: '',
	dataSetIndex: 0,
	source: {
		descriptor: '',
		filterId: null,
		value: null
	}
});

export const withAttributeFieldset = <Config: Object>(Component: React$ComponentType<Config & ContextProps>): React$ComponentType<Config> => {
	return class WrappedComponent extends React.Component<Config> {
		renderComponent = (props: ContextProps) => {
			return <Component {...this.props} {...props} />;
		};

		render () {
			return (
				<AttributeFieldsetContext.Consumer>
					{this.renderComponent}
				</AttributeFieldsetContext.Consumer>
			);
		}
	};
};

export default withAttributeFieldset;
