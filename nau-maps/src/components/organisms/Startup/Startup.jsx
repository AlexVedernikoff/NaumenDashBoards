// @flow
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';
import {setHeight} from 'helpers';

export class Startup extends Component<Props> {
	componentDidMount () {
		this.timer = null;
		const {getAppConfig} = this.props;

		if (window.frameElement) {
			window.addEventListener('resize', setHeight);
			this.timer = window.setTimeout(setHeight, 1500);
		}

		getAppConfig();
	}

	componentWillUnmount () {
		window.removeEventListener('resize', setHeight);
		clearTimeout(this.timer);
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
