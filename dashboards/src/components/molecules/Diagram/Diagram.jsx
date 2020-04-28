// @flow
import {Chart, Summary} from 'components/molecules';
import cn from 'classnames';
import {FONT_STYLES, TEXT_HANDLERS, WIDGET_TYPES} from 'store/widgets/data/constants';
import type {Props} from './types';
import React, {Component, Fragment} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';
import {Table} from 'components/organisms';

export class Diagram extends Component<Props> {
	shouldComponentUpdate (nextProps: Props) {
		const {buildData: {loading: nextLoading, updateDate: nextUpdateDate}, widget: nextWidget} = nextProps;
		const {buildData: {loading: prevLoading, updateDate: prevUpdateDate}, widget: prevWidget} = this.props;

		return nextUpdateDate !== prevUpdateDate || nextLoading !== prevLoading || nextWidget !== prevWidget;
	}

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

	renderDiagram = () => (
		<div className={styles.diagram}>
			{this.resolveDiagram()}
		</div>
	);

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
		const {fontColor, fontFamily, fontSize, fontStyle, name, show, textAlign, textHandler} = header;

		if (show) {
			const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
			const {CROP, WRAP} = TEXT_HANDLERS;
			const nameCN = cn({
				[styles.name]: true,
				[settingsStyles.bold]: fontStyle === BOLD,
				[settingsStyles.italic]: fontStyle === ITALIC,
				[settingsStyles.underline]: fontStyle === UNDERLINE,
				[settingsStyles.crop]: textHandler === CROP,
				[settingsStyles.wrap]: textHandler === WRAP
			});

			return (
				<div className={nameCN} style={{color: fontColor, fontFamily, fontSize: Number(fontSize), textAlign}}>
					{name}
				</div>
			);
		}

		return null;
	};

	render () {
		return (
			<div className={styles.container}>
				{this.renderLoading()}
				{this.renderError()}
				{this.renderContent()}
			</div>
		);
	}
}

export default Diagram;
