// @flow
import {array, number, object, string} from 'yup';

const schema = array().of(object({
	attributes: array().min(1, 'Необходимо выбрать атрибут'),
	dataSetIndex: number().typeError('Необходимо указать источник').required('Необходимо указать источник'),
	label: string().required('Укажите название фильтра')
}));

export default schema;
