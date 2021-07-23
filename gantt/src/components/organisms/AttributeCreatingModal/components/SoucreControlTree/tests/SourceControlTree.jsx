import {getProps} from './helpers';
import {getTree} from 'components/molecules/TreeSelect/components/Tree/tests/helpers';
import React from 'react';
import {shallow} from 'enzyme';
import SourceControlTree from 'components/organisms/AttributeCreatingModal/components/SoucreControlTree';

describe('AttributeCreatingModal SourceControlTree', () => {
	it('renders when "searchValue" property is set to empty string', () => {
		const wrapper = shallow(<SourceControlTree {...getProps()} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders when "searchValue" property is set to not empty string', () => {
		const wrapper = shallow(<SourceControlTree {...getProps()} searchValue="test" />);

		expect(wrapper).toMatchSnapshot();
	});

	it('method "countAttributes" returns attributes count of the passed options', () => {
		const limit = 4;
		const options = getTree(2, limit);
		const wrapper = shallow(<SourceControlTree {...getProps()} options={options} />);

		expect(wrapper.instance().countAttributes(options)).toEqual(Math.pow(limit, 2));
	});
})

