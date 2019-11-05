// @flow
import React, {Component} from 'react';
import type {Props} from 'containers/Startup/types';
import Toast from 'components/atoms/Toast';

export class Startup extends Component<Props> {
	componentDidMount () {
		const {getAppConfig} = this.props;

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
