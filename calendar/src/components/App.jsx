// @flow
import '@progress/kendo-theme-default/dist/all.css';
import React, {useEffect, useState} from 'react';
import Calendar from 'containers/Calendar';
import CalendarSelectors from 'containers/CalendarSelectors';
import {getInitParams} from 'utils/calendarInit';
import styles from 'styles/app.less';

const App = () => {
	const [initParams, setInitParams] = useState({
		metaClass: null,
		subjectId: null
	});

	useEffect(() => {
		(async () => {
			const params = await getInitParams();
			if (params) {
				setInitParams(params);
			}
		})();
	}, []);

	return (
		<div className={styles.wrapper}>
			<CalendarSelectors initParams={initParams} />
			<Calendar />
		</div>
	);
};

export default App;
