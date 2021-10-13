// @flow
import cn from 'classnames';
import FormPanel from 'components/organisms/FormPanel';
import {Icon, Loader} from 'naumen-common-components';
import type {Props, State} from './types';
import React, {PureComponent, Suspense} from 'react';
import styles from './styles.less';

export class GanttPanel extends PureComponent<Props, State> {
	state = {
		swiped: false
	};

	handleToggle = () => this.setState({swiped: !this.state.swiped});

	renderContent = () => {
		const content = <FormPanel />;
		return (
			<div className={styles.content}>
				<Suspense fallback={this.renderFallback()}>
					{content}
				</Suspense>
			</div>
		);
	};

	renderDrawerControl = () => {
		const {swiped} = this.state;
		const CN = cn({
			[styles.drawerControl]: true,
			[styles.activeDrawerControl]: swiped
		});

		return (
			<div className={CN} onClick={this.handleToggle}>
				<Icon className={styles.drawerIcon} name="DRAWER" />
			</div>
		);
	};

	renderFallback = () => {
		return (
			<div className={styles.fallback}>
				<Loader size={50} />
			</div>
		);
	};

	render () {
		const {swiped} = this.state;
		const CN = cn({
			[styles.container]: true,
			[styles.swipedContainer]: swiped
		});

		return (
			<div className={CN} id='panel'>
				{this.renderDrawerControl()}
				{this.renderContent()}
			</div>
		);
	}
}

export default GanttPanel;
