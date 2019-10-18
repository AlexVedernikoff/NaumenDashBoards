// @flow
import {number, object} from 'yup';

const initialValues = {
	constant: ''
};

const schema = object().shape({
	constant: number('Константа должна быть числом').required('Введите константу')
});

export {
	initialValues,
	schema
};
