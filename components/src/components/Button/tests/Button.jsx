import Button from 'components/Button';
import React from 'react';
import {shallow} from 'enzyme';

describe('Button', () => {
	it('renders correctly', () => {
		const wrapper = shallow(<Button >test</Button>);

		expect(wrapper).toMatchSnapshot();
	});
});
