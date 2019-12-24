// @flow
import type {ComponentType} from 'react';
import {FormContext} from './WidgetFormPanel';
import type {Props} from 'containers/WidgetFormPanel/types';
import React from 'react';
import type {WrappedProps} from './types';

export const withForm = (Component: ComponentType<WrappedProps>) => {
	return class WrappedComponent extends React.Component<WrappedProps> {
		renderComponent = (formProps: Object | Props) => {
			return <Component {...this.props} {...formProps} />;
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
