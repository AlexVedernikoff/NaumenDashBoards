// @flow

import type {Props} from 'containers/VerificationContent/types';
import React, {PureComponent} from 'react';
import styles from './styles.less';

export class FinishedVerificationContent extends PureComponent<Props> {
	renderVerificationRow = ({title, values}, index) => {
		return (
			<tr key={index}>
				<td>{title}</td>
				<td>
					<ul>
						{values.map((value, i) => <ol key={i}>{value}</ol>)}
					</ul>
				</td>
			</tr>);
	};

	render () {
		const {setting} = this.props;

		if (!setting.verification.length) {
			return (
				<div className={styles.content}>
					Проверки пройдены
				</div>
			);
		}

		return (
			<div className={styles.content}>
				<table className={styles.table}>
					<tbody>
						{setting.verification.map(this.renderVerificationRow)}
					</tbody>
				</table>
			</div>
		);
	}
}

export default FinishedVerificationContent;
