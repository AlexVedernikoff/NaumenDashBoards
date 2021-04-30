// @flow
import type {CommonDialogContextProps} from './types';
import React, {createContext} from 'react';

export const CommonDialogContext: React$Context<Object> = createContext(null);

export const withCommonDialog = (Component: React$ComponentType<Object>) => {
	return class WrappedComponent extends React.Component<Object> {
		renderComponent = (props: CommonDialogContextProps) => {
			return <Component {...this.props} {...props} />;
		};

		render () {
			return (
				<CommonDialogContext.Consumer>
					{this.renderComponent}
				</CommonDialogContext.Consumer>
			);
		}
	};
};

export default withCommonDialog;
