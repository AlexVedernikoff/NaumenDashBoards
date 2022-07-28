// @flow
import cn from 'classnames';
import type {Props} from 'containers/Startup/types';
import React, {Component} from 'react';
import {SET_BLUR_ROOT_CONTEXT} from './withBlurRoot';
import type {State} from './types';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class Startup extends Component<Props, State> {
	state = {
		blur: false
	};

	componentDidMount () {
		const {fetchDashboard} = this.props;

		fetchDashboard();
	}

	handleSetBlur = (blur: boolean) => {
		this.setState({blur});
	};

	render () {
		const {children, error, loading, personal} = this.props;
		const {blur} = this.state;

		if (error) {
			return <p>{error}</p>;
		}

		if (loading) {
			return (<p><T text="Startup::Loading" /></p>);
		}

		const className = cn(styles.container, {[styles.blur]: blur});

		return (
			<SET_BLUR_ROOT_CONTEXT.Provider value={this.handleSetBlur}>
				<div className={className} key={personal.toString()}>
					{children}
				</div>
			</SET_BLUR_ROOT_CONTEXT.Provider>
		);
	}
}

export default Startup;
