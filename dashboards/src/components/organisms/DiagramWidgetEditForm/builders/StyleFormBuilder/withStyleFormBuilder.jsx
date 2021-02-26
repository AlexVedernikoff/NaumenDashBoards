// @flow
import type {ComponentType} from 'react';
import React from 'react';
import type {StyleBuilderProps, WrappedProps} from './types';
import StyleFormBuilder from './StyleFormBuilder';

export const withStyleFormBuilder = (Component: ComponentType<WrappedProps>) => {
	return class WrappedStyleBoxComponent extends React.Component<WrappedProps> {
		handleChange = (valueName: string, value: any) => {
			const {data, name, onChange} = this.props;

			onChange(name, {
				...data,
				[valueName]: value
			});
		};

		renderComponent = (props: StyleBuilderProps) => <Component {...this.props} {...props} />;

		render () {
			const {data} = this.props;

			return <StyleFormBuilder data={data} onChange={this.handleChange} render={this.renderComponent} />;
		}
	};
};

export default withStyleFormBuilder;
