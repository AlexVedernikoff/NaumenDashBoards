// @flow
import type {Props, SubscribeAction, SubscribeCommand, Subscriptions} from './types';
import React, {Component} from 'react';
import {SUBSCRIBE_COMMANDS, SUBSCRIBE_CONTEXT} from './constants';

class SubscribeManager extends Component<Props> {
	subscriptions: Subscriptions = {};

	componentDidMount () {
		const {emitterRef} = this.props;

		if (emitterRef) {
			emitterRef.emit = this.emit;
		}
	}

	emit = async (action: SubscribeCommand) => {
		const actions = this.subscriptions[action];

		if (actions) {
			await Promise.all(actions.map(action => action()));
		}
	};

	getSubscribeContext = () => ({
		subscribe: this.subscribe,
		unsubscribe: this.unsubscribe
	});

	subscribe = (action: SubscribeCommand, handle: SubscribeAction) => {
		if (!this.subscriptions[action]) {
			this.subscriptions[action] = [];
		}

		this.subscriptions[action].push(handle);
	};

	unsubscribe = (action: SubscribeCommand, handle: SubscribeAction) => {
		if (this.subscriptions[action]) {
			this.subscriptions[action] = this.subscriptions[action].filter(item => item !== handle);
		}
	};

	render () {
		const {children} = this.props;
		return (
			<SUBSCRIBE_CONTEXT.Provider value={this.getSubscribeContext()}>
				{children}
			</SUBSCRIBE_CONTEXT.Provider>
		);
	}
}

export {SUBSCRIBE_COMMANDS};

export default SubscribeManager;
