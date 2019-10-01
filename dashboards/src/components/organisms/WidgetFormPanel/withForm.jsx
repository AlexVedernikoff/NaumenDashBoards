// @flow
import type {ComponentType} from 'react';
import {FormContext} from './WidgetFormPanel';
import React from 'react';
import type {WrappedProps} from './types';

export const withForm = (Component: ComponentType<WrappedProps>) => {
	return class WrappedComponent extends React.Component<WrappedProps> {
		renderComponent = (form: WrappedProps) => {
			return <Component {...this.props} {...form} />;
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
