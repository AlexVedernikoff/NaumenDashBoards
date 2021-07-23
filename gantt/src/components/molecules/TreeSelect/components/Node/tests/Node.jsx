import {getNode, getProps} from './helpers';
import Node from 'components/molecules/TreeSelect/components/Node';
import React from 'react';
import {shallow} from 'enzyme';

describe('TreeSelect Node', () => {
	it('renders without children when no child provided', () => {
		const wrapper = shallow(<Node {...getProps()} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders with children when "expanded" property is set to "false"', () => {
		const data = getNode({children: ['child1', 'child2']});
		const props = getProps({
			children: children => children.join(),
			data
		});

		const wrapper = shallow(<Node {...props} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders with children when "expanded" property is set to "true"', () => {
		const data = getNode({children: ['child1', 'child2']});
		const props = getProps({
			children: children => children.join(),
			data
		});

		const wrapper = shallow(<Node {...props} />);
		wrapper.setState({expanded: true});

		expect(wrapper).toMatchSnapshot();
	});

	it('renders no "showMore" link when "showMore" property is set to "false"', () => {
		const wrapper = shallow(<Node {...getProps()} showMore={false} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders "showMore" link when "showMore" property is set to "true"', () => {
		const data = getNode({children: ['child1'], uploaded: false});
		const wrapper = shallow(<Node {...getProps()} data={data} showMore={true} />);

		wrapper.setState({expanded: true});

		expect(wrapper).toMatchSnapshot();
	});

	it('handles onClick properly and calls provided callback with node data as first parameter', () => {
		const mockOnClick = jest.fn();
		const props = getProps({
			onClick: mockOnClick
		});

		const wrapper = shallow(<Node {...props} />);

		wrapper.find('.label').simulate('click');

		expect(mockOnClick.mock.calls.length).toEqual(1);
		expect(mockOnClick.mock.calls[0][0]).toEqual(props.data);
	});

	it('handles onExpand properly and calls "onLoadChildren" callback with node data as first parameter', () => {
		const data = getNode({children: []});
		const props = getProps({data});
		const mockOnLoadChildren = jest.fn();
		const wrapper = shallow(<Node {...props} onLoadChildren={mockOnLoadChildren} />);

		wrapper.find('.toggleIconContainer').simulate('click');

		expect(mockOnLoadChildren.mock.calls.length).toEqual(1);
		expect(mockOnLoadChildren.mock.calls[0][0]).toEqual(data);
	});

	it('changes "expanded" property when toggle container', () => {
		const data = getNode({children: []});
		const props = getProps({data});
		const wrapper = shallow(<Node {...props} />);

		wrapper.find('.toggleIconContainer').simulate('click');
		expect(wrapper.state('expanded')).toEqual(true);

		wrapper.find('.toggleIconContainer').simulate('click');
		expect(wrapper.state('expanded')).toEqual(false);
	});

	it('calls no callback when "disabled" property is set to "true"', () => {
		const data = getNode({children: []});
		const mockOnClick = jest.fn();
		const wrapper = shallow(<Node {...getProps()} data={data} disabled={true} onClick={mockOnClick} />);

		wrapper.find('.toggleIconContainer').simulate('click');

		expect(mockOnClick.mock.calls.length).toEqual(0);
		expect(wrapper.exists('.disabledLabel')).toEqual(true);
	});

	it('adds "selectedNode" css class when "selected" property is set to "true"', () => {
		const wrapper = shallow(<Node {...getProps()} selected={true} />);

		expect(wrapper.exists('.selectedNode')).toEqual(true);
	});

	it('adds "foundNode" css class when node label contains "searchValue" property', () => {
		const wrapper = shallow(<Node {...getProps()} getNodeLabel={() => 'test'} searchValue="te" />);

		expect(wrapper.exists('.foundNode')).toEqual(true);
	});
})
