// @flow
import {Chart, Summary} from 'components/molecules';
import cn from 'classnames';
import type {DivRef} from 'components/types';
import {FONT_STYLES, TEXT_HANDLERS, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {Props, State} from './types';
import React, {Component, createRef, Fragment} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';
import {Table} from 'components/organisms';

export class Diagram extends Component<Props, State> {
	ref: DivRef = createRef();
	nameRef: DivRef = createRef();

	state = {
		nameRendered: false
	};

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
		const {buildData, onUpdate, widget} = this.props;
		const {data} = buildData;
		const {BAR, BAR_STACKED, COLUMN, COLUMN_STACKED, COMBO, DONUT, LINE, PIE, SUMMARY, TABLE} = WIDGET_TYPES;

		switch (widget.type) {
			case BAR:
			case BAR_STACKED:
			case COLUMN:
			case COLUMN_STACKED:
			case COMBO:
			case DONUT:
			case LINE:
			case PIE:
				return <Chart data={data} widget={widget} />;
			case SUMMARY:
				return <Summary data={data} widget={widget} />;
			case TABLE:
				return <Table data={data} onUpdate={onUpdate} widget={widget} />;
			default:
				return null;
		}
	};

	renderContent = () => {
		const {buildData} = this.props;
		const {error, loading} = buildData;

		if (!(loading || error)) {
			return (
				<Fragment>
					{this.renderName()}
					{this.renderDiagram()}
				</Fragment>
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
				height = container.clientHeight - nameContainer.clientHeight;
			}

			return (
				<div style={{height}}>
					{this.resolveDiagram()}
				</div>
			);
		}
	};

	renderError = () => {
		const {error} = this.props.buildData;

		if (error) {
			return <p>Ошибка загрузки данных. Измените параметры построения.</p>;
		}
	};

	renderLoading = () => {
		const {loading} = this.props.buildData;

		if (loading) {
			return <p>Загрузка...</p>;
		}
	};

	renderName = () => {
		const {header} = this.props.widget;
		const {nameRendered} = this.state;
		const {fontColor, fontFamily, fontSize, fontStyle, name, show, textAlign, textHandler} = header;

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
					{name}
				</div>
			);
		}

		return null;
	};

	render () {
		return (
			<div className={styles.container} ref={this.ref}>
				{this.renderLoading()}
				{this.renderError()}
				{this.renderContent()}
			</div>
		);
	}
}

export default Diagram;
