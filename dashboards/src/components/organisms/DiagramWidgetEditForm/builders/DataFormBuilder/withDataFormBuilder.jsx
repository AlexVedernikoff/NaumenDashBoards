// @flow
import type {ComponentType} from 'react';
import type {DataBuilderProps} from './types';
import DataFormBuilder from './DataFormBuilder';
import type {ParamsTabProps} from 'DiagramWidgetEditForm/types';
import React from 'react';

export const withDataFormBuilder = (Component: ComponentType<DataBuilderProps>) => {
	return class WrappedStyleBoxComponent extends React.Component<ParamsTabProps> {
		renderComponent = (props: DataBuilderProps) => <Component {...props} />;

		render () {
			return <DataFormBuilder {...this.props} render={this.renderComponent} />;
		}
	};
};

export default withDataFormBuilder;
