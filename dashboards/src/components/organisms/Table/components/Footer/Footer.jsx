// @flow
import {Cell, Row} from 'Table/components';
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class Header extends PureComponent<Props> {
	renderColumn = (column: Column, index: number) => {
		const {columnsWidth} = this.props;
		const {accessor, footer} = column;

		return <Cell key={accessor} value={footer} width={columnsWidth[index]} />;
	};

	render () {
		const {columns, width} = this.props;

		return (
			<tfoot className={styles.header} style={{minWidth: width}}>
				<Row>{columns.map(this.renderColumn)}</Row>
			</tfoot>
		);
	}
}

export default Header;
