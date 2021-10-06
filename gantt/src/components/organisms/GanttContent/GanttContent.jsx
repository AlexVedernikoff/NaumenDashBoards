// @flow
import GanttGrid from 'components/molecules/Gantt';
import GanttPanel from 'containers/GanttPanel';
import type {Props} from 'containers/GanttContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class GanttContent extends PureComponent<Props> {
	renderGanttGrid = () => {
		const {errorData} = this.props;
		return errorData ? <p>Ошибка загрузки данных</p> : <GanttGrid style={{height: '100%', width: '100%'}} />;
	};

	renderPanel = () => {
		const {editMode} = this.props;
		return editMode ? <GanttPanel /> : null;
	};

	render () {
		return (
			<div className={styles.content}>
				{this.renderPanel()}
				{this.renderGanttGrid()}
			</div>
		);
	}
}

export default GanttContent;
