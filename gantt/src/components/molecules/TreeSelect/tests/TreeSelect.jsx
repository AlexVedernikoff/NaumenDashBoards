import {getNode} from 'components/molecules/TreeSelect/components/Node/tests/helpers';
import {getProps} from './helpers';
import {getOptionLabel, getOptionValue} from 'components/molecules/TreeSelect/helpers';
import {getTree} from 'components/molecules/TreeSelect/components/Tree/tests/helpers';
import React from 'react';
import {shallow} from 'enzyme';
import TreeSelect from 'components/molecules/TreeSelect';

describe('TreeSelect', () => {
	it('renders when no options provided', () => {
		const wrapper = shallow(<TreeSelect {...getProps()} options={{}} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders menu when "showMenu" property is changing', () => {
		const wrapper = shallow(<TreeSelect {...getProps()} options={getTree(2, 2)} />);

		expect(wrapper).toMatchSnapshot();

		wrapper.setState({showMenu: true});

		expect(wrapper).toMatchSnapshot();
	});

	it('renders when "removable" property is set to "true"', () => {
		const wrapper = shallow(<TreeSelect {...getProps()} options={{}} removable={true} value={{}} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('handles onSelect properly and calls provided callback', () => {
		const mockOnSelect = jest.fn();
		const props = getProps();
		const node = getNode();

		const wrapper = shallow(<TreeSelect {...props} onSelect={mockOnSelect} />);

		wrapper.instance().handleSelect(node);

		expect(mockOnSelect.mock.calls.length).toEqual(1);
		expect(mockOnSelect.mock.calls[0][0]).toEqual({
			name: props.name,
			value: node
		});
	});

	it('handles onRemove and calls provided callback', () => {
		const mockOnRemove = jest.fn();
		const props = getProps();

		const wrapper = shallow(<TreeSelect {...props} onRemove={mockOnRemove} />);

		wrapper.instance().handleClickRemoveButton();

		expect(mockOnRemove.mock.calls.length).toEqual(1);
		expect(mockOnRemove.mock.calls[0][0]).toEqual(props.name);
	});

	it('method "getOptionLabel" returns label of "value" property or node value', () => {
		const label = 'test';

		expect(getOptionLabel({label})).toEqual(label);
		expect(getOptionLabel(null)).toEqual('');
	});

	it('method "getOptionValue" returns value of "value" property or node value', () => {
		const value = 'test';

		expect(getOptionValue({value})).toEqual(value);
		expect(getOptionValue(null)).toEqual(undefined);
	});

	it('method "getNodeLabel" returns node label', () => {
		const node = getNode();
		const wrapper = shallow(<TreeSelect {...getProps()} />);

		expect(wrapper.instance().getNodeLabel(node)).toEqual(node.value.label);
	});

	it('method "getNodeValue" returns node value', () => {
		const node = getNode();
		const wrapper = shallow(<TreeSelect {...getProps()} />);

		expect(wrapper.instance().getNodeValue(node)).toEqual(node.value.value);
	});

	it('method "getFoundTree" returns found tree when uses one level of the tree', () => {
		const options = getTree(1, 3);
		const wrapper = shallow(<TreeSelect {...getProps()} options={options} />);
		const fountOptions = wrapper.instance().getFoundTree(options, 'node1');

		expect(Object.keys(fountOptions).length).toEqual(1);
	});

	it('method "getFoundTree" returns found tree when uses nested tree', () => {
		const options = getTree(2, 3);
		const wrapper = shallow(<TreeSelect {...getProps()} options={options} />);
		const fountTree = wrapper.instance().getFoundTree(options, 'node1');

		expect(Object.keys(fountTree).length).toEqual(6);
	});

	it('method "getFoundTree" returns found tree is not case sensitive', () => {
		const options = getTree(2, 3);
		const wrapper = shallow(<TreeSelect {...getProps()} options={options} />);
		const upperFoundTree = wrapper.instance().getFoundTree(options, 'NODE1');
		const lowerFoundTree = wrapper.instance().getFoundTree(options, 'node1');

		expect(Object.keys(upperFoundTree).length).toEqual(Object.keys(lowerFoundTree).length);
	});
})
