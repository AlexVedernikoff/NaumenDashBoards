// @flow
import React from 'react';
import styles from './style.less';
import type {Props} from './types';

export const DashboardTemplate = ({ children: [header, content, aside] }: Props) => (
	<div>
		{header}
		<div>
			{content}
		</div>
		<aside className={styles.aside}>
			{aside}
		</aside>
	</div>
);

export default DashboardTemplate;
