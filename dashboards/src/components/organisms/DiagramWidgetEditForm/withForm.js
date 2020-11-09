// @flow
import type {ContextProps} from './types';
import {FormContext} from './DiagramWidgetEditForm';
import React from 'react';

export const withForm = (Component: React$ComponentType<Object>) => {
	return class WrappedComponent extends React.Component<Object> {
		renderComponent = (props: ContextProps) => {
			return <Component {...this.props} {...props} />;
		};

		render () {
			return (
				<FormContext.Consumer>
					{this.renderComponent}
				</FormContext.Consumer>
			);
		}
	};
};

export default withForm;
