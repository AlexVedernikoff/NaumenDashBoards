// @flow
import WidgetForm from './WidgetForm';
import withTabs from './HOCs/withTabs';

const TabbedWidgetForm = withTabs(WidgetForm);

export {
	TabbedWidgetForm
};

export default WidgetForm;
