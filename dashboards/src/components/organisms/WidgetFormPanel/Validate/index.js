import Schema from './shemas';
import * as yup from 'yup';

export const Validate = (values) => { 
  return Schema[values.type.value].validate(values, {abortEarly: false}).catch(err => err);
};

export default Validate;