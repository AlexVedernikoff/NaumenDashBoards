// @flow
import {breakpoints, cols, width} from 'constants/layout';
import type {ChildrenArray, Element} from 'react';
import type {Props} from './types';
import React, {Component} from 'react';
import {Responsive as Layout} from 'react-grid-layout';
import styles from './style.less';
import type {Widget} from 'entities';

export class ResponsiveLayout extends Component<Props> {
	renderWidget = (widget: Widget): Element<any> => (
		<div key={widget.id} data-grid={widget.layout} className={styles.widget}>
				<p>{widget.name}</p>
		</div>
	);

	renderWidgets (): ChildrenArray<Element<any>> {
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
