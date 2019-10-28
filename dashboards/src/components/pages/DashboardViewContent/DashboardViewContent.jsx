// @flow
import LayoutGrid from 'containers/LayoutGrid';
import type {Props} from 'containers/DashboardViewContent/types';
import React, {Component, createRef} from 'react';
import styles from './styles.less';

export const viewContentRef = createRef();

export class DashboardViewContent extends Component<Props> {
	render () {
		const {widgets} = this.props;

		return (
			<div className={styles.container}>
				<div className={styles.grid} ref={viewContentRef}>
					<LayoutGrid widgets={widgets}/>
				</div>
			</div>
		);
	}
}

export default DashboardViewContent;
