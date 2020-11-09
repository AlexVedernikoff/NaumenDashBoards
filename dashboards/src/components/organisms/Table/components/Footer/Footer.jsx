// @flow
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Header extends PureComponent<Props> {
	renderColumn = (column: Column) => {
		const {columnsWidth, components} = this.props;
		const {FooterCell} = components;
		const {accessor, footer} = column;

		return (
			<FooterCell
				className={styles.cell}
				column={column}
				components={components}
				key={accessor}
				value={footer}
				width={columnsWidth[accessor]}
			/>
		);
	};

	render () {
		const {columns, components, width} = this.props;
		const {Row} = components;

		return (
			<div className={styles.header} style={{width}}>
				<Row>{columns.map(this.renderColumn)}</Row>
			</div>
		);
	}
}

export default Header;
