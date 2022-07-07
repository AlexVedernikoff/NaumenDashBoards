// @flow
import {connect} from 'react-redux';
import {functions, props} from './selectors';
import Gantt from 'components/atoms/Gantt';
import {Loader} from 'naumen-common-components';
import React from 'react';
import styles from './styles.less';

const GanttGrid = (props: Props) => {
	if (props.loading) {
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
					allLinks={props.allLinks}
					attributesMap={props.attributesMap}
					columns={props.columns}
					currentVersion={props.currentVersion}
					editWorkDateRangesFromVersion={props.editWorkDateRangesFromVersion}
					flag={props.flag}
					getGanttData={props.getGanttData}
					getListOfWorkAttributes={props.getListOfWorkAttributes}
					milestones={props.milestones}
					newTask={props.newTask}
					postEditedWorkData={props.postEditedWorkData}
					postNewWorkData={props.postNewWorkData}
					progress={props.progress}
					progressCheckbox={props.progressCheckbox}
					refresh={props.refresh}
					resources={props.resources}
					rollUp={props.rollUp}
					saveChangedWorkInterval ={props.saveChangedWorkInterval }
					saveChangedWorkProgress={props.saveChangedWorkProgress}
					saveChangedWorkRelations={props.saveChangedWorkRelations}
					scale={props.scale}
					style={{height: '100%', width: '100%'}}
					switchProgressCheckbox={props.switchProgressCheckbox}
					tasks={props.tasks}
					workAttributes={props.workAttributes}
					workLink={props.workLink}
					workRelationCheckbox={props.workRelationCheckbox}
					workRelations={props.workRelations}
				/>
			</div>
		</div>
	);
};

export default connect(props, functions)(GanttGrid);
