// @flow
import 'styles/customTheme.css';
import React, {useEffect} from 'react';
import Calendar from 'containers/Calendar';
import CalendarSelectors from 'containers/CalendarSelectors';
import type {Props} from 'containers/App/types';
import styles from 'styles/app.less';

const App = ({getInitParams}: Props) => {
	useEffect(() => {
		getInitParams();
	}, []);

	return (
		<div className={styles.wrapper}>
			<CalendarSelectors />
			<Calendar />
		</div>
	);
};

export default App;
