// @flow
import type {Option} from 'GroupModal/types';

const getValue = (options: Array<Option>, type: string): Option => options.find(option => option.value === type) ?? options[0];

export {
	getValue
};
