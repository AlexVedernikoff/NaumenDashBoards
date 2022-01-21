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
		this.state = {
			flag: false,
			refresh: false,
			swiped: false
		};
	}

	handleToggle = () => {
		this.setState({swiped: !this.state.swiped});
		this.renderPanel();
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
		return errorData ? <p>Ошибка загрузки данных</p> : <GanttGrid flag={this.state.flag} refresh={this.state.refresh} style={{height: '100%', width: '100%'}} />;
	};

	renderPanel = () => {
		const {editMode} = this.props;
		return editMode ? <GanttPanel handleToggle={() => this.handleToggle()} swiped={this.state.swiped} /> : null;
	};

	renderАctionBar = () => {
		const {editMode} = this.props;
		return editMode ? <АctionBar handleToggle={() => this.handleToggle()} onClick={() => this.onMove()} refresh={() => this.onRefresh()} /> : null;
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
