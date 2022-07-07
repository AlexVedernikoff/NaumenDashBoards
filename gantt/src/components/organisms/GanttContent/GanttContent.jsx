// @flow
import АctionBar from 'components/molecules/АctionBar';
import GanttGrid from 'components/molecules/Gantt';
import GanttPanel from 'containers/GanttPanel';
import ErrorBoundary from 'src/components/organisms/ErrorBoundary/ErrorBoundary.jsx';
import type {Props} from 'containers/GanttContent/types';
import {connect} from 'react-redux';
import React, {PureComponent} from 'react';
import {functions, props} from './selectors';
import styles from './styles.less';

export class GanttContent extends PureComponent<Props> {
	constructor (props) {
		super(props);
		this.onMove = this.onMove.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
		this.handleToggleProgress = this.handleToggleProgress.bind(this);
		this.handleToggleLinks = this.handleToggleLinks.bind(this);
		this.handleToggleMilestoneBlock = this.handleToggleMilestoneBlock.bind(this);
		this.addNewTask = this.addNewTask.bind(this);
		this.state = {
			flag: false,
			milestones: '',
			name: 'Просмотреть',
			newTask: false,
			refresh: false,
			swiped: false
		};
	}

	addNewTask () {
		this.setState({ newTask: !this.state.newTask });
	}

	handleToggle = () => {
		this.setState({swiped: !this.state.swiped});
		this.state.name === 'Просмотреть' ? this.setState({name: 'Редактировать'}) : this.setState({name: 'Просмотреть'});
	};

	handleToggleLinks = () => {
		this.props.switchWorkRelationCheckbox(!this.props.workRelationCheckbox);
	};

	handleToggleMilestoneBlock = () => {
		this.setState({ milestones: !this.state.milestones });
	};

	handleToggleProgress = () => {
		this.props.switchProgressCheckbox(!this.props.progressCheckbox);
	};

	onRefresh () {
		this.setState({ refresh: !this.state.refresh });
		this.renderGanttGrid();
	}

	onMove () {
		this.setState({ flag: !this.state.flag });
		this.renderGanttGrid();
	}

	renderGanttGrid = () => {
		const {errorData} = this.props;
		const {allLinks, flag, milestones, newTask, progress, refresh} = this.state;

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

	renderPanel = () => {
		const {editMode} = this.props;

		return editMode
			? <GanttPanel
				allLinks={this.state.allLinks}
				handleToggle={this.handleToggle}
				handleToggleLinks={this.handleToggleLinks}
				handleToggleMilestoneBlock={this.handleToggleMilestoneBlock}
				handleToggleProgress={this.handleToggleProgress}
				milestones={this.state.milestones}
				progress={this.state.progress}
				swiped={this.state.swiped}
			/> : null;
	};

	renderАctionBar = () => {
		const {editMode} = this.props;

		return (
			<АctionBar
				addNewTask={this.addNewTask}
				editMode={editMode}
				handleToggle={this.handleToggle}
				name={this.state.name}
				onClick={this.onMove}
				refresh={this.onRefresh}
			/>);
	};

	render () {
		return (
			<div className={styles.content}>
				{this.renderАctionBar()}
				{this.renderPanel()}
				{this.renderGanttGrid()}
			</div>
		);
	}
}

export default connect(props, functions)(GanttContent);
