// @flow
import {connect} from 'react-redux';
import Gantt from 'components/atoms/Gantt';
import {Loader} from 'naumen-common-components';
import {props} from './selectors';
import React from 'react';
import styles from './styles.less';

const GanttGrid = (props: Props) => {
	const {columns, loading, rollUp, scale, tasks} = props;

	if (loading && (!tasks.length || !columns.length)) {
		return (
			<div className={styles.center}>
				<Loader size={50} />
			</div>
		);
	}

	return (
		<div style={{height: '100vh', width: '100%'}}>
			<div className="gantt-container" style={{height: '100%', position: 'absolute', width: '100%'}}>
				<Gantt columns={columns} rollUp={rollUp} scale={scale} style={{height: '100%', width: '100%'}} tasks={tasks} />
			</div>
		</div>
	);
};

export default connect(props)(GanttGrid);
