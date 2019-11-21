// @flow
import React, {Component} from 'react';
import type {Props} from 'containers/Startup/types';
import Toast from 'components/atoms/Toast';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {getAppConfig} = this.props;

		if (window.frameElement) {
			const height = window.frameElement.height;
			window.frameElement.setAttribute('style', `min-height:${height}px`);
		}
		getAppConfig();
	}

	render () {
		const {children} = this.props;

		return (
			<div>
				<Toast />
				{children}
			</div>
		);
	}
}

export default Startup;
