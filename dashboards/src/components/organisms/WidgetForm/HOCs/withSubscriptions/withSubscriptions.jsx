// @flow
import React from 'react';
import {SUBSCRIBE_COMMANDS, SUBSCRIBE_CONTEXT} from './constants';
import type {SubscribeContext} from './types';

export const withSubscriptions = <Config: {}>(
	Component: React$ComponentType<Config & SubscribeContext>
): React$ComponentType<Config> =>
		class WithSubscribeContext extends React.Component<Config> {
			renderComponent = (context: SubscribeContext) =>
				<Component {...this.props} subscribe={context.subscribe} unsubscribe={context.unsubscribe} />;

			render () {
				return (
					<SUBSCRIBE_CONTEXT.Consumer>
						{context => this.renderComponent(context)}
					</SUBSCRIBE_CONTEXT.Consumer>
				);
			}
		};

export {SUBSCRIBE_COMMANDS};

export default withSubscriptions;
