// @flow
import '@progress/kendo-theme-default/dist/all.css';
import React, {Fragment} from 'react';
import Calendar from 'containers/Calendar';
import CalendarSelectors from 'containers/CalendarSelectors';

const App = () => {
	return (
		<Fragment>
			<CalendarSelectors />
			<Calendar />
		</Fragment>
	);
};

export default App;
