// @flow
import АctionBar from 'components/molecules/АctionBar';
import GanttGrid from 'components/molecules/Gantt';
import GanttPanel from 'containers/GanttPanel';
import type {Props} from 'containers/GanttContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class GanttContent extends PureComponent<Props> {
	constructor (props) {
		super(props);
		this.onMove = this.onMove.bind(this);
		this.onRefresh = this.onRefresh.bind(this);
		this.handleToggle = this.handleToggle.bind(this);
		this.handleToggleProgress = this.handleToggleProgress.bind(this);
		this.handleToggleLinks = this.handleToggleLinks.bind(this);
		this.addNewTask = this.addNewTask.bind(this);
		this.state = {
			allLinks: false,
			flag: false,
			name: 'Просмотреть',
			newTask: false,
			progress: false,
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
		this.setState({allLinks: !this.state.allLinks});
	};

	handleToggleProgress = () => {
		this.setState({progress: !this.state.progress});
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
		const {allLinks, flag, newTask, progress, refresh} = this.state;

		return errorData
			? <p>Ошибка загрузки данных</p>
			: <GanttGrid
				allLinks={allLinks}
				flag={flag}
				newTask={newTask}
				progress={progress}
				refresh={refresh}
				style={{height: '100%', width: '100%'}}
			/>;
	};

	renderPanel = () => {
		const {editMode} = this.props;

		return editMode
			? <GanttPanel
				allLinks={this.state.allLinks}
				handleToggle={this.handleToggle}
				handleToggleLinks={this.handleToggleLinks}
				handleToggleProgress={this.handleToggleProgress}
				progress={this.state.progress} swiped={this.state.swiped}
			/> : null;
	};

	renderАctionBar = () => {
		return (
			<АctionBar
				addNewTask={this.addNewTask}
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

export default GanttContent;
