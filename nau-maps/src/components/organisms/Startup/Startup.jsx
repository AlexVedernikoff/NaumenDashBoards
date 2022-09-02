// @flow
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {getAppConfig} = this.props;

		if (window.frameElement) {
			window.setTimeout(() => {
				const height = window.frameElement.height;
				window.frameElement.setAttribute('style', `min-height:${height}px`);
			}, 100);
		}

		getAppConfig();
	}

	render () {
		const {children} = this.props;

		return (
			<div>
				{children}
			</div>
		);
	}
}

export default Startup;
