// @flow
import type {InjectedProps} from './types';
import React from 'react';
import {WIDGET_CONTEXT} from './constants';

export const withWidget = <Props: {} & InjectedProps>(Component: React$ComponentType<Props>): React$ComponentType<Props> => {
	return class WrappedComponent extends React.Component<Props> {
		render () {
			return (
				<WIDGET_CONTEXT.Consumer>
					{widget => <Component {...this.props} widget={widget} />}
				</WIDGET_CONTEXT.Consumer>
			);
		}
	};
};

export default withWidget;
