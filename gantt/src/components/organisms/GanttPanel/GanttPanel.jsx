// @flow
import cn from 'classnames';
import FormPanel from 'components/organisms/FormPanel';
import {Icon, Loader} from 'naumen-common-components';
import type {Props, State} from './types';
import React, {PureComponent, Suspense} from 'react';
import styles from './styles.less';

export class GanttPanel extends PureComponent<Props, State> {
	renderContent = () => {
		const content = <FormPanel
			allLinks={this.props.allLinks}
			handleToggle={this.props.handleToggle}
			handleToggleLinks={this.props.handleToggleLinks}
			handleToggleMilestoneBlock={this.props.handleToggleMilestoneBlock}
			handleToggleProgress={this.props.handleToggleProgress}
			milestones={this.props.milestones}
			progress={this.props.progress}
		/>;
		return (
			<div className={styles.content}>
				<Suspense fallback={this.renderFallback()}>
					{content}
				</Suspense>
			</div>
		);
	};

	renderDrawerControl = () => {
		const CN = cn({
			[styles.drawerControl]: true,
			[styles.activeDrawerControl]: this.props.swiped
		});

		return (
			<div className={CN} onClick={this.props.handleToggle}>
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
		const CN = cn({
			[styles.container]: true,
			[styles.swipedContainer]: this.props.swiped
		});

		return (
			<div className={CN} id='panel'>
				{this.renderContent()}
			</div>
		);
	}
}

export default GanttPanel;
