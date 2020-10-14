// @flow
import {Chart, Summary} from 'components/molecules';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {FONT_STYLES, HEADER_POSITIONS, TEXT_HANDLERS, WIDGET_TYPES} from 'store/widgets/data/constants';
import {PADDING} from './constants';
import type {Props, State} from './types';
import React, {Component, createRef} from 'react';
import settingsStyles from 'styles/settings.less';
import {SpeedometerWidget, TableWidget} from 'components/organisms';
import styles from './styles.less';

export class Diagram extends Component<Props, State> {
	ref: DivRef = createRef();
	nameRef: DivRef = createRef();

	state = {
		nameRendered: false
	};

	componentDidMount () {
		if (this.nameRef.current) {
			this.setState({nameRendered: true});
		}
	}

	componentDidUpdate (prevProps: Props) {
		if (this.nameRef.current && this.isUpdated(prevProps, this.props)) {
			this.setState({nameRendered: true});
		}
	}

	isUpdated = (prevProps: Props, nextProps: Props) => {
		const {buildData: {loading: prevLoading, updateDate: prevUpdateDate}, widget: prevWidget} = prevProps;
		const {buildData: {loading: nextLoading, updateDate: nextUpdateDate}, widget: nextWidget} = nextProps;

		return nextUpdateDate !== prevUpdateDate || nextLoading !== prevLoading || nextWidget !== prevWidget;
	};

	resolveDiagram = () => {
		const {buildData, focused, onDrillDown, onUpdate, showSubmenu, widget} = this.props;
		const {data} = buildData;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SPEEDOMETER, SUMMARY, TABLE} = WIDGET_TYPES;

		switch (widget.type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case COMBO:
			case DONUT:
			case LINE:
			case PIE:
				return <Chart data={data} focused={focused} showSubmenu={showSubmenu} widget={widget} />;
			case SPEEDOMETER:
				return <SpeedometerWidget data={data} widget={widget} />;
			case SUMMARY:
				return <Summary data={data} widget={widget} />;
			case TABLE:
				return <TableWidget data={data} onDrillDown={onDrillDown} onUpdate={onUpdate} widget={widget} />;
			default:
				return null;
		}
	};

	renderContent = () => {
		const {buildData, widget} = this.props;
		const {error, loading} = buildData;

		if (!(loading || error)) {
			const contentCN = cn({
				[styles.content]: true,
				[styles.reverseContent]: widget.header.position === HEADER_POSITIONS.BOTTOM
			});

			return (
				<div className={contentCN}>
					{this.renderName()}
					{this.renderDiagram()}
				</div>
			);
		}

		return null;
	};

	renderDiagram = () => {
		const {show} = this.props.widget.header;
		const {nameRendered} = this.state;

		if (!show || nameRendered) {
			const {current: container} = this.ref;
			const {current: nameContainer} = this.nameRef;
			let height = '100%';

			if (show && container && nameContainer) {
				height = container.clientHeight - nameContainer.clientHeight - (PADDING * 2);
			}

			return (
				<div className={styles.diagramContainer} style={{height}}>
					{this.resolveDiagram()}
				</div>
			);
		}
	};

	renderError = () => {
		const {error} = this.props.buildData;
		const message = 'Ошибка загрузки данных. Измените параметры построения.';

		if (error) {
			return <div className={styles.error} title={message}>{message}</div>;
		}
	};

	renderLoading = () => {
		const {loading} = this.props.buildData;

		if (loading) {
			return <p>Загрузка...</p>;
		}
	};

	renderName = () => {
		const {header, name: widgetName} = this.props.widget;
		const {nameRendered} = this.state;
		const {fontColor, fontFamily, fontSize, fontStyle, name, show, textAlign, textHandler, useName} = header;

		if (show) {
			const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
			const {CROP, WRAP} = TEXT_HANDLERS;
			const nameCN = cn({
				[styles.hideName]: !nameRendered,
				[settingsStyles.bold]: fontStyle === BOLD,
				[settingsStyles.italic]: fontStyle === ITALIC,
				[settingsStyles.underline]: fontStyle === UNDERLINE,
				[settingsStyles.crop]: textHandler === CROP,
				[settingsStyles.wrap]: textHandler === WRAP
			});

			return (
				<div className={nameCN} ref={this.nameRef} style={{color: fontColor, fontFamily, fontSize: Number(fontSize), textAlign}}>
					{useName ? widgetName : name}
				</div>
			);
		}

		return null;
	};

	render () {
		return (
			<div className={styles.container} ref={this.ref} style={{padding: PADDING}}>
				{this.renderLoading()}
				{this.renderError()}
				{this.renderContent()}
			</div>
		);
	}
}

export default Diagram;
