// @flow
import type {Column} from 'Table/types';
import type {Props} from './types';
import React, {PureComponent} from 'react';

export class Footer extends PureComponent<Props> {
	renderColumn = (column: Column) => {
		const {columnsWidth, components} = this.props;
		const {FooterCell} = components;
		const {accessor, footer} = column;

		return (
			<FooterCell
				column={column}
				components={components}
				key={accessor}
				value={footer}
				width={columnsWidth[accessor]}
			/>
		);
	};

	render () {
		const {columns, components} = this.props;
		const {Row} = components;

		return <Row>{columns.map(this.renderColumn)}</Row>;
	}
}

export default Footer;
