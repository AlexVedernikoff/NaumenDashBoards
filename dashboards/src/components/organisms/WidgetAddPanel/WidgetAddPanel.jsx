// @flow
import type {DivRef} from 'components/types';
import Icon, {ICON_NAMES} from 'components/atoms/Icon';
import type {LangType} from 'localization/localize_types';
import NewWidget from 'store/widgets/data/NewWidget';
import type {Props} from 'containers/WidgetAddPanel/types';
import React, {Component, createRef} from 'react';
import type {State} from './types';
import styles from './styles.less';
import T from 'components/atoms/Translation';
import t from 'localization';
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class WidgetAddPanel extends Component<Props, State> {
	relativeElement: DivRef = createRef();

	state = {
		copyWidgetMode: false
	};

	addDiagramWidget = () => {
		const {newWidgetDisplay} = this.props;

		this.addWidget(new NewWidget(newWidgetDisplay));
	};

	addTextWidget = () => {
		const {newWidgetDisplay} = this.props;

		this.addWidget(new NewWidget(newWidgetDisplay, WIDGET_TYPES.TEXT));
	};

	addWidget = (widget: NewWidget) =>
		widget && this.props.addNewWidget(widget, this.relativeElement);

	showCopyDiagramWidget = () => { this.props.showCopyPanel(); };

	renderCopyWidgetRow = () => {
		const {canShowCopyPanel} = this.props;

		if (canShowCopyPanel) {
			return (
				<div className={styles.titleRow} onClick={this.showCopyDiagramWidget} title={t('WidgetAddPanel::CopyWidgetTitle')}>
					<span><T text='WidgetAddPanel::CopyWidget' /></span>
					<Icon name={ICON_NAMES.EXPAND} />
				</div>
			);
		}

		return null;
	};

	renderTitleRow = (title: LangType, clickEvent: () => void) => (
		<div className={styles.titleRow} onClick={clickEvent} >
			<span><T text={title} /></span>
			<Icon name={ICON_NAMES.EXPAND} />
		</div>
	);

	render () {
		return (
			<div className={styles.title} ref={this.relativeElement}>
				{this.renderTitleRow('WidgetAddPanel::AddText', this.addTextWidget)}
				{this.renderTitleRow('WidgetAddPanel::AddWidget', this.addDiagramWidget)}
				{this.renderCopyWidgetRow()}
			</div>
		);
	}
}

export default WidgetAddPanel;
