// @flow
import cn from 'classnames';
import {ControlPanel} from './components';
import {createContextName, createSnapshot, exportSheet, FILE_VARIANTS} from 'utils/export';
import {Diagram} from 'components/molecules';
import type {DivRef} from 'components/types';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props, State} from './types';
import React, {createRef, PureComponent} from 'react';
import styles from './styles.less';

export class Widget extends PureComponent<Props, State> {
	static defaultProps = {
		className: ''
	};

	state = {
		hasError: false
	};

	ref: DivRef = createRef();

	static getDerivedStateFromError (error: Object) {
		window.top.console.log(error);

		return {
			hasError: true
		};
	}

	componentDidMount () {
		const {buildData, data, fetchBuildData} = this.props;

		if (data.id !== NewWidget.id && !buildData) {
			fetchBuildData(data);
		}
	}

	componentDidUpdate (prevProps: Props) {
		if (prevProps.buildData) {
			const {buildData: {loading: nextLoading, updateDate: nextUpdateDate}} = prevProps;
			const {buildData: {loading: prevLoading, updateDate: prevUpdateDate}} = this.props;

			if (nextLoading !== prevLoading || nextUpdateDate !== prevUpdateDate) {
				this.setState({hasError: false});
			}
		}
	}

	getClassName = () => {
		const {className, focused, isSelected} = this.props;

		return cn({
			[styles.widget]: true,
			[styles.focusedWidget]: focused,
			[styles.selectedWidget]: isSelected,
			[className]: true
		});
	};

	handleClick = (e: MouseEvent) => {
		const {data, onClick} = this.props;

		e.stopPropagation();
		onClick(data.id);
	};

	handleEdit = () => {
		const {data, onEdit} = this.props;
		onEdit(data.id, this.ref);
	};

	handleExport = async (type: string) => {
		const {buildData, data: widget} = this.props;
		const {current} = this.ref;
		const contextName = await createContextName();
		const name = `${widget.name}_${contextName}`;

		if (type === FILE_VARIANTS.XLSX) {
			return exportSheet(name, buildData.data);
		}

		if (current) {
			createSnapshot({
				container: current,
				fragment: true,
				name,
				toDownload: true,
				type
			});
		}
	};

	renderControlPanel = () => {
		const {
			data: widget,
			editWidgetChunkData,
			isEditable,
			onDrillDown,
			onRemove,
			personalDashboard,
			user
		} = this.props;

		return (
			<ControlPanel
				className={styles.controlPanel}
				editWidgetChunkData={editWidgetChunkData}
				isEditable={isEditable}
				onDrillDown={onDrillDown}
				onEdit={this.handleEdit}
				onExport={this.handleExport}
				onRemove={onRemove}
				personalDashboard={personalDashboard}
				user={user}
				widget={widget}
			/>
		);
	};

	renderDiagram = () => {
		const {buildData, data, focused, isNew, onDrillDown, onOpenCardObject, onUpdate} = this.props;
		const {hasError} = this.state;

		if (!isNew && buildData && !hasError) {
			return (
				<Diagram
					buildData={buildData}
					focused={focused}
					onDrillDown={onDrillDown}
					onOpenCardObject={onOpenCardObject}
					onUpdate={onUpdate}
					widget={data}
				/>
			);
		}
	};

	renderError = () => {
		const {hasError} = this.state;
		const message = 'Ошибка построения.';

		return hasError && <div className={styles.error} title={message}>{message}</div>;
	};

	render () {
		const {children, onMouseDown, onMouseUp, onTouchEnd, onTouchStart, style} = this.props;
		const gridProps = {
			onMouseDown,
			onMouseUp,
			onTouchEnd,
			onTouchStart,
			style
		};

		return (
			<div {...gridProps} className={this.getClassName()} onClick={this.handleClick} ref={this.ref}>
				{this.renderControlPanel()}
				{this.renderDiagram()}
				{this.renderError()}
				{children}
			</div>
		);
	}
}

export default Widget;
