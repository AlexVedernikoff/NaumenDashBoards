// @flow
import type {ComponentType} from 'react';
import type {Context} from './types';
import {GroupContext} from './GroupCreatingModal';
import React, {PureComponent} from 'react';

const withGroup = (Component: ComponentType<Object>) => {
	return class WrappedComponent extends PureComponent<Object> {
		renderComponent = (props: Context) => {
			return <Component {...this.props} {...props} />;
		};

		render () {
			return (
				<GroupContext.Consumer>
					{this.renderComponent}
				</GroupContext.Consumer>
			);
		}
	};
};

export default withGroup;
