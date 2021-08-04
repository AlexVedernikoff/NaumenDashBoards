// @flow
import GanttPanel from 'containers/GanttPanel';
import type {Props} from 'containers/GanttContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class GanttContent extends PureComponent<Props> {
	renderPanel = () => {
		const {editMode} = this.props;
		return editMode ? <GanttPanel /> : null;
	};

	render () {
		return (
			<div className={styles.content}>
				{this.renderPanel()}
			</div>
		);
	}
}

export default GanttContent;
