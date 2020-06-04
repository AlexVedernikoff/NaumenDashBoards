// @flow
import cn from 'classnames';
import {FONT_STYLES} from 'store/widgets/data/constants';
import {getBuildSet} from 'store/widgets/data/helpers';
import {hasMSInterval, parseMSInterval} from 'store/widgets/helpers';
import type {Props, State} from './types';
import React, {PureComponent} from 'react';
import settingsStyles from 'styles/settings.less';
import styles from './styles.less';

export class Summary extends PureComponent<Props, State> {
	render () {
		const {data, widget} = this.props;
		const {fontColor, fontFamily, fontSize, fontStyle} = widget.indicator;
		const {total} = data;
		const {BOLD, ITALIC, UNDERLINE} = FONT_STYLES;
		const containerCN = cn({
			[styles.container]: true,
			[settingsStyles.bold]: fontStyle === BOLD,
			[settingsStyles.italic]: fontStyle === ITALIC,
			[settingsStyles.underline]: fontStyle === UNDERLINE
		});
		const value = hasMSInterval(getBuildSet(widget)) ? parseMSInterval(total) : total;

		return (
			<div className={containerCN} style={{color: fontColor, fontFamily, fontSize: Number(fontSize)}}>
				{value}
			</div>
		);
	}
}

export default Summary;
