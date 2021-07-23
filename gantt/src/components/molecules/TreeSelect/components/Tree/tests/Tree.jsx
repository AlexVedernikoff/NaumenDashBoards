import {getNode} from 'components/molecules/TreeSelect/components/Node/tests/helpers';
import {getProps, getTree} from './helpers';
import React from 'react';
import {shallow} from 'enzyme';
import Tree from 'components/molecules/TreeSelect/components/Tree';

describe('TreeSelect Tree', () => {
	it('renders when no options provided', () => {
		const wrapper = shallow(<Tree {...getProps()} options={{}} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders when options provided', () => {
		const wrapper = shallow(<Tree {...getProps()} options={getTree(2, 2)} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders when "loading" property is set to "true"', () => {
		const wrapper = shallow(<Tree {...getProps()} loading={true} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders when "showMore" property is set to "true"', () => {
		const wrapper = shallow(<Tree {...getProps()} showMore={true} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('method "isSelected" returns "true" when node value equal to "value" property', () => {
		const value = {
			label: 'label',
			value: 'test'
		};
		const node = getNode({value});
		const wrapper = shallow(<Tree {...getProps()} value={value} />);

		expect(wrapper.instance().isSelected(node)).toEqual(true);
	});

	it('method "isSelected" returns "true" when "values" property contains node value', () => {
		const value = {
			label: 'label',
			value: 'test'
		};
		const node = getNode({value});
		const wrapper = shallow(<Tree {...getProps()} multiple={true} values={[value]} />);

		expect(wrapper.instance().isSelected(node)).toEqual(true);
	});

	it('handles onFetch by mount and calls provided callback', () => {
		const mockOnFetch = jest.fn();

		shallow(<Tree {...getProps()} onFetch={mockOnFetch} />);

		expect(mockOnFetch.mock.calls.length).toEqual(1);
	});

	it('handles onFetch when clicked "showMore" link and calls provided callback', () => {
		const mockOnFetch = jest.fn();
		const wrapper = shallow(<Tree {...getProps()} onFetch={mockOnFetch} options={{}} />, { disableLifecycleMethods: true });

		wrapper.instance().handleClickShowMore();

		expect(mockOnFetch.mock.calls.length).toEqual(1);
		expect(mockOnFetch.mock.calls[0][0]).toEqual(null);
		expect(mockOnFetch.mock.calls[0][1]).toEqual(0);
	});

	it('handles onFetch by node and calls provided callback', () => {
		const mockOnFetch = jest.fn();
		const children = ['child'];
		const node = getNode({children, uploaded: false});
		const wrapper = shallow(<Tree {...getProps()} onFetch={mockOnFetch} />, { disableLifecycleMethods: true });

		wrapper.instance().handleLoadChildren(node);

		expect(mockOnFetch.mock.calls.length).toEqual(1);
		expect(mockOnFetch.mock.calls[0][0]).toEqual(node);
		expect(mockOnFetch.mock.calls[0][1]).toEqual(children.length);
	});
})
