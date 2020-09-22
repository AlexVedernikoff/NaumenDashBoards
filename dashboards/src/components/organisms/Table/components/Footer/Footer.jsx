// @flow
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Header extends PureComponent<Props> {
	renderColumn = (column: Column, index: number) => {
		const {columnsWidth, components} = this.props;
		const {FooterCell} = components;
		const {accessor, footer} = column;

		return (
			<FooterCell
				column={column}
				key={accessor}
				value={footer}
				width={columnsWidth[index]}
			/>
		);
	};

	render () {
		const {columns, components, width} = this.props;
		const {Row} = components;

		return (
			<tfoot className={styles.header} style={{minWidth: width}}>
				<Row>{columns.map(this.renderColumn)}</Row>
			</tfoot>
		);
	}
}

export default Header;
