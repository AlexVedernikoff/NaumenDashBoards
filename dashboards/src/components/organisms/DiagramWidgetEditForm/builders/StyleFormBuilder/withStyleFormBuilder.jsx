// @flow
import type {ComponentType} from 'react';
import React from 'react';
import type {StyleBuilderProps, WrappedProps} from './types';
import StyleFormBuilder from './StyleFormBuilder';

export const withStyleFormBuilder = (Component: ComponentType<WrappedProps>) => {
	return class WrappedStyleBoxComponent extends React.Component<WrappedProps> {
		renderComponent = (props: StyleBuilderProps) => <Component {...this.props} {...props} />;

		render () {
			const {data, name, onChange} = this.props;
			return <StyleFormBuilder data={data} name={name} onChange={onChange} render={this.renderComponent} />;
		}
	};
};

export default withStyleFormBuilder;
