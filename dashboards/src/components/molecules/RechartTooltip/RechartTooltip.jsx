// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './style.less';

export class RechartTooltip extends PureComponent<Props> {
	render () {
		const {active, fill, indicator, parameter, show, value} = this.props;

		if (active && show) {
			return (
				<div className={styles.container}>
					<div className={styles.title}>{indicator}</div>
					<div className={styles.series}>
						<div className={styles.marker} style={{backgroundColor: fill}} />
						<div className={styles.seriesName}>{parameter}</div>
						<div className={styles.value}>{value}</div>
					</div>
				</div>
			);
		}

		return null;
	}
}

export default RechartTooltip;
