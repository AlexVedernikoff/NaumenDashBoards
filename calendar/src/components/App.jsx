// @flow
import '@progress/kendo-theme-default/dist/all.css';
import Calendar from 'containers/Calendar';
import CalendarSelectors from 'containers/CalendarSelectors';
import React from 'react';
import styles from 'styles/app.less';

const App = () => (
	<div className={styles.wrapper}>
		<CalendarSelectors />
		<Calendar />
	</div>
);

export default App;
