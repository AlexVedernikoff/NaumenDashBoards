// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import Gantt from 'components/atoms/Gantt';
import {Loader} from 'naumen-common-components';
import React from 'react';
import styles from './styles.less';

const GanttGrid = (props: Props) => {
	const {allLinks, attributesMap, columns, getGanttData, getListOfWorkAttributes, links, loading, newTask, progress, resources, rollUp, saveChangedWorkInterval, saveChangedWorkProgress, saveChangedWorkRelations, scale, tasks, workAttributes} = props;

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
					attributesMap={attributesMap}
					columns={columns}
					flag={props.flag}
					getGanttData={getGanttData}
					getListOfWorkAttributes={getListOfWorkAttributes}
					links={links}
					newTask={newTask}
					progress={progress}
					refresh={props.refresh}
					resources={resources}
					rollUp={rollUp}
					saveChangedWorkInterval ={saveChangedWorkInterval }
					saveChangedWorkProgress={saveChangedWorkProgress}
					saveChangedWorkRelations={saveChangedWorkRelations}
					scale={scale}
					style={{height: '100%', width: '100%'}}
					tasks={tasks}
					workAttributes={workAttributes}
				/>
			</div>
		</div>
	);
};

export default connect(props, functions)(GanttGrid);
