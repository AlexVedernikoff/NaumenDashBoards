// @flow
import type {Props} from './types';
import React, {PureComponent} from 'react';
import styles from './styles.less';
import T from 'components/atoms/Translation';

export class EmptyWidget extends PureComponent<Props> {
	render () {
		const {header} = this.props.widget;
		const {fontColor, fontFamily, fontSize} = header;
		const style = {fontFamily, fontSize};

		return (
			<div className={styles.container}>
				<svg>
					<text dominantBaseline="middle" fill={fontColor} style={style} textAnchor="middle" x="50%" y="50%">
						<T text='LoadingContent::Empty' />
					</text>
				</svg>
			</div>
		);
	}
}

export default EmptyWidget;
