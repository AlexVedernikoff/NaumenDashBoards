// @flow
import type {ComponentType} from 'react';
import type {ContextProps} from './types';
import React, {createContext} from 'react';

export const CustomGroupContext: Object = createContext({});

export const withCustomGroup = (Component: ComponentType<Object>) => {
	return class WrappedComponent extends React.Component<Object> {
		renderComponent = (props: ContextProps) => {
			return <Component {...this.props} {...props} />;
		};

		render () {
			return (
				<CustomGroupContext.Consumer>
					{this.renderComponent}
				</CustomGroupContext.Consumer>
			);
		}
	};
};

export default withCustomGroup;
