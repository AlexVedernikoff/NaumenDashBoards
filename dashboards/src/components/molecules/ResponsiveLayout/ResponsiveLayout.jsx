// @flow
import {breakpoints, cols, width} from 'constants/layout';
import type {ChildrenArray, Node} from 'react';
import type {Props} from './types';
import React, {Component} from 'react';
import {Responsive as Layout} from 'react-grid-layout';
import styles from './style.less';
import type {Widget} from 'entities';

export class ResponsiveLayout extends Component<Props> {
	handleClick = (id: string) => () => {
		const {editWidget} = this.props;
		editWidget(id);
	};

	renderWidgetDescription = (widget: Widget): Node => (
		<div>
			{widget.isNameShown && <p className={styles.name}>{widget.name}</p>}
			{widget.description && <p className={styles.description}>{widget.description}</p>}
			{widget.isEditable && <button className={styles.edit} type="button" onClick={this.handleClick(widget.id)}>
				Редактировать
			</button>}
		</div>
	);

	renderWidget = (widget: Widget): Node => (
		<div key={widget.id} data-grid={widget.layout} className={styles.widget}>
			<div className={styles.top}>
				{this.renderWidgetDescription(widget)}
			</div>
		</div>
	);

	renderWidgets (): ChildrenArray<Node> {
		const {widgets} = this.props;
		return widgets.map(this.renderWidget);
	}

	render () {
		const {onLayoutChange} = this.props;

		return (
			<Layout
				className="layout"
				cols={cols}
				breakpoints={breakpoints}
				width={width}
				onLayoutChange={onLayoutChange}
			>
				{this.renderWidgets()}
			</Layout>
		);
	}
}

export default ResponsiveLayout;
