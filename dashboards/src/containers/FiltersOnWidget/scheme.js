// @flow
import {array, lazy, number, object, string} from 'yup';
import t from 'localization';

const schema = lazy(() => array().of(object({
	attributes: array().min(1, t('FiltersOnWidget::Scheme::Attribute')),
	dataSetIndex: number().typeError(t('FiltersOnWidget::Scheme::Source')).required(t('FiltersOnWidget::Scheme::Source')),
	label: string().required(t('FiltersOnWidget::Scheme::Name'))
})));

export default schema;
