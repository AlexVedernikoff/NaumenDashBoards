// @flow
import АctionBar from 'components/molecules/АctionBar';
import cn from 'classnames';
import {connect} from 'react-redux';
import ErrorBoundary from 'src/components/atoms/ErrorBoundary/ErrorBoundary.jsx';
import {functions, props} from './selectors';
import GanttGrid from 'components/molecules/Gantt';
import GanttPanel from 'containers/GanttPanel';
import type {Props} from 'containers/GanttContent/types';
import React, {useState} from 'react';
import styles from './styles.less';
import ViewPanel from 'components/molecules/ViewPanel';

const GanttContent = (props: Props) => {
	const {allLinks, editMode, errorData, isPersonal, progress, user} = props;
	const {role} = user;
	const [flag, setFlag] = useState(false);
	const [milestones] = useState('');
	const [name, setName] = useState('Просмотреть');
	const [newTask, setNewTask] = useState(false);
	const [refresh, setRefresh] = useState(false);
	const [swiped, setSwiped] = useState(false);

	const panelCN = cn({
		[styles.container]: true,
		[styles.personal]: !props.isPersonal,
		[styles.content]: true
	});

	const addNewTask = () => setNewTask(!newTask);

	const handleToggle = () => {
		setSwiped(!swiped);
		name === 'Просмотреть' ? setName('Редактировать') : setName('Просмотреть');
	};

	const handleToggleLinks = () => props.switchWorkRelationCheckbox(!props.workRelationCheckbox);

	const handleToggleMilestoneBlock = () => props.switchMilestonesCheckbox(!props.milestonesCheckbox);

	const handleToggleProgress = () => props.switchProgressCheckbox(!props.progressCheckbox);

	const handleToggleStateMilestoneBlock = () => props.switchStateMilestonesCheckbox(!props.stateMilestonesCheckbox);

	const onRefresh = () => setRefresh(!refresh);

	const onMove = () => setFlag(!flag);

	const renderGanttGrid = () => {
		return errorData
			? <p>Ошибка загрузки данных</p>
			: <ErrorBoundary><GanttGrid
				allLinks={allLinks}
				flag={flag}
				milestones={milestones}
				newTask={newTask}
				progress={progress}
				refresh={refresh}
				style={{height: '100%', width: '100%'}}
			></GanttGrid></ErrorBoundary>;
	};

	const renderPanel = () => {
		return (editMode || isPersonal)
			? <GanttPanel
				allLinks={allLinks}
				handleToggle={handleToggle}
				handleToggleLinks={handleToggleLinks}
				handleToggleMilestoneBlock={handleToggleMilestoneBlock}
				handleToggleProgress={handleToggleProgress}
				handleToggleStateMilestoneBlock={handleToggleStateMilestoneBlock}
				isPersonal={props.isPersonal}
				milestones={milestones}
				progress={progress}
				role={props.user.role}
				swiped={swiped}
			/> : null;
	};

	const renderViewPanel = () => (role !== 'SUPER' && !!role) ? <ViewPanel /> : null;

	const renderАctionBar = () => {
		const {editMode} = props;

		return (
			<АctionBar
				addNewTask={addNewTask}
				editMode={editMode}
				handleToggle={handleToggle}
				name={name}
				onClick={onMove}
				refresh={onRefresh}
			/>);
	};

	return (
		<div className={panelCN}>
			{renderViewPanel()}
			{renderАctionBar()}
			{renderPanel()}
			{renderGanttGrid()}
		</div>
	);
};

export default connect(props, functions)(GanttContent);
