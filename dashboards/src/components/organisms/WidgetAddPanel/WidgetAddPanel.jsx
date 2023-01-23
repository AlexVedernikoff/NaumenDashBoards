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
import {WIDGET_TYPES} from 'store/widgets/data/constants';

export class WidgetAddPanel extends Component<Props, State> {
	relativeElement: DivRef = createRef();

	state = {
		copyWidgetMode: false
	};

	addDiagramWidget = () => {
		const {layoutMode} = this.props;

		this.addWidget(new NewWidget(layoutMode));
	};

	addTextWidget = () => {
		const {layoutMode} = this.props;

		this.addWidget(new NewWidget(layoutMode, WIDGET_TYPES.TEXT));
	};

	addWidget = (widget: NewWidget) => widget && this.props.addNewWidget(widget, this.relativeElement);

	showCopyDiagramWidget = () => { this.props.showCopyPanel(); };

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
				{this.renderTitleRow('WidgetAddPanel::CopyWidget', this.showCopyDiagramWidget)}
			</div>
		);
	}
}

export default WidgetAddPanel;
