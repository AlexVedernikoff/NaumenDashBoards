// @flow
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class Footer extends PureComponent<Props> {
	renderColumn = (column: Column, index: number, columns: Array<Column>) => {
		const {columnsWidth, components, fixedColumnsCount, fixedLeft} = this.props;
		const {FooterCell} = components;
		const {accessor, footer} = column;
		const left = fixedColumnsCount - index > 0 ? fixedLeft : 0;
		const last = index === columns.length - 1;

		return (
			<FooterCell
				column={column}
				components={components}
				key={accessor}
				last={last}
				left={left}
				value={footer}
				width={columnsWidth[accessor]}
			/>
		);
	};

	render () {
		const {columns, components, width} = this.props;
		const {Row} = components;

		return (
			<div style={{width}}>
				<Row>{columns.map(this.renderColumn)}</Row>
			</div>
		);
	}
}

export default Footer;
