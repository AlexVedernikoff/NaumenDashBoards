// @flow
import cn from 'classnames';
import FormPanel from 'components/organisms/FormPanel';
import {Loader} from 'naumen-common-components';
import type {Props} from './types';
import React, {Suspense} from 'react';
import styles from './styles.less';

export const GanttPanel = (props: Props) => {
	const {role} = props;

	const renderFallback = () => {
		return (
			<div className={styles.fallback}>
				<Loader size={50} />
			</div>
		);
	};

	const renderContent = () => {
		const content = <FormPanel
			allLinks={props.allLinks}
			handleToggle={props.handleToggle}
			handleToggleLinks={props.handleToggleLinks}
			handleToggleMilestoneBlock={props.handleToggleMilestoneBlock}
			handleToggleProgress={props.handleToggleProgress}
			handleToggleStateMilestoneBlock={props.handleToggleStateMilestoneBlock}
			handleToggleWorksWithoutDates={props.handleToggleWorksWithoutDates}
			isPersonal={props.isPersonal}
			milestones={props.milestones}
			progress={props.progress}
			role = {props.role}
		/>;
		return (
			<div className={styles.content}>
				<Suspense fallback={renderFallback()}>
					{content}
				</Suspense>
			</div>
		);
	};

	const CN = cn({
		[styles.container]: true,
		[styles.personal]: (props.isPersonal && role !== 'SUPER') || (role === 'ganttMaster'),
		[styles.swipedContainer]: props.swiped
	});

	return (
		<div className={CN} id='panel'>
			{renderContent()}
		</div>
	);
};

export default GanttPanel;
