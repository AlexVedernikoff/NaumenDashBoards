// @flow
import {connect} from 'react-redux';
import Gantt from 'components/atoms/Gantt';
import {Loader} from 'naumen-common-components';
import {props} from './selectors';
import React from 'react';
import styles from './styles.less';

const GanttGrid = (props: Props) => {
	const {allLinks, columns, links, loading, newTask, progress, rollUp, scale, tasks} = props;

	if (loading) {
		return (
			<div className={styles.center}>
				<Loader size={50} />
			</div>
		);
	}

	return (
		<div style={{height: '100vh', width: '100%'}}>
			<div className="gantt-container" style={{height: '100%', position: 'absolute', width: '100%'}}>
				<Gantt
					allLinks={allLinks}
					columns={columns}
					flag={props.flag}
					links={links}
					newTask={newTask}
					progress={progress}
					refresh={props.refresh}
					rollUp={rollUp}
					scale={scale}
					style={{height: '100%', width: '100%'}}
					tasks={tasks}
				/>
			</div>
		</div>
	);
};

export default connect(props)(GanttGrid);
