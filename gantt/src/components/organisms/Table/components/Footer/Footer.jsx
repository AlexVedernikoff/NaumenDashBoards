// @flow
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Footer extends PureComponent<Props> {
	renderColumn = (column: Column, index: number, columns: Array<Column>) => {
		const {columnsWidth, components, fixedPositions, scrollBarWidth} = this.props;
		const {FooterCell} = components;
		const {accessor, footer} = column;
		const left = fixedPositions[accessor];
		const last = index === columns.length - 1;
		let width = columnsWidth[accessor];

		if (last) {
			width += scrollBarWidth;
		}

		return (
			<FooterCell
				column={column}
				components={components}
				key={accessor}
				last={last}
				left={left}
				value={footer}
				width={width}
			/>
		);
	};

	render () {
		const {columns, components, forwardedRef, width} = this.props;
		const {Row} = components;

		return (
			<div className={styles.footer} ref={forwardedRef}>
				<Row width={width}>{columns.map(this.renderColumn)}</Row>
			</div>
		);
	}
}

export default Footer;
