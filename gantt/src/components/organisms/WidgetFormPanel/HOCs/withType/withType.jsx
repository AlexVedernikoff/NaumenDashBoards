// @flow
import type {Context, InjectedProps, Props} from './types';
import React from 'react';
import {TYPE_CONTEXT} from 'components/organisms/WidgetFormPanel/HOCs/withType/constants';

export const withType = <Config: Props & InjectedProps>(Component: React$ComponentType<Config>): React$ComponentType<Config> => {
	return class WithType extends React.Component<Props> {
		renderComponent = (context: Context) => <Component {...this.props} type={context} />;

		render () {
			return (
				<TYPE_CONTEXT.Consumer>
					{context => this.renderComponent(context)}
				</TYPE_CONTEXT.Consumer>
			);
		}
	};
};

export default withType;
