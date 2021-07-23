import {CONTROL_TYPES} from 'components/organisms/AttributeCreatingModal/constants';
import {getAttribute, getProps, getSource} from './helpers';
import {getNode} from 'components/molecules/TreeSelect/components/Node/tests/helpers';
import {mount, shallow} from 'enzyme';
import React from 'react';
import SourceControl from 'components/organisms/AttributeCreatingModal/components/SourceControl';

describe('AttributeCreatingModal SourceControl', () => {
	it('renders when property "value" is not set to "null"', () => {
		const wrapper = mount(<SourceControl {...getProps()} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders when property "value" is set to "null"', () => {
		const wrapper = mount(<SourceControl {...getProps()} value={null} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('handles onAddConstant properly and calls provided callback', () => {
		const mockOnAddConstant = jest.fn();
		const props = getProps();
		const wrapper = shallow(<SourceControl {...props} onAddConstant={mockOnAddConstant} />);

		wrapper.instance().handleAddConstant();

		expect(mockOnAddConstant.mock.calls.length).toEqual(1);
		expect(mockOnAddConstant.mock.calls[0][0]).toEqual(props.index);
		expect(mockOnAddConstant.mock.calls[0][1]).toEqual(props.name);
	});

	it('handles onSelect properly and calls provided callback', () => {
		const mockOnSelect = jest.fn();
		const props = getProps();
		const dataKey = 'dataKey';
		const node = getNode({
			parent: dataKey,
			value: getAttribute()
		});
		const options = {
			[dataKey]: getNode({value: getSource()})
		};
		const wrapper = shallow(<SourceControl {...props} onSelect={mockOnSelect} options={options} />);

		wrapper.instance().handleSelect({value: node});

		expect(mockOnSelect.mock.calls.length).toEqual(1);
		expect(mockOnSelect.mock.calls[0][0]).toEqual(props.index);
		expect(mockOnSelect.mock.calls[0][1]).toEqual(props.name);
		expect(mockOnSelect.mock.calls[0][2]).toMatchObject(props.value);
		expect(mockOnSelect.mock.calls[0][3]).toEqual(CONTROL_TYPES.SOURCE);
	});

	it('method "getNodeLabel" works correctly', () => {
		const component = shallow(<SourceControl {...getProps()} />).instance();
		const sourceId = 'dataKey';
		const sourceNode = getNode({id: sourceId, value: getSource()});
		const attributeNode = getNode({parent: sourceId, value: getAttribute()});

		expect(component.getNodeLabel(sourceNode)).toEqual(sourceNode.value.label);
		expect(component.getNodeLabel(attributeNode)).toEqual(attributeNode.value.title);
	});

	it('method "getNodeValue" works correctly', () => {
		const component = shallow(<SourceControl {...getProps()} />).instance();
		const sourceId = 'dataKey';
		const sourceNode = getNode({id: sourceId, value: getSource()});
		const attributeNode = getNode({parent: sourceId, value: getAttribute()});

		expect(component.getNodeValue(sourceNode)).toEqual(sourceNode.id);
		expect(component.getNodeValue(attributeNode)).toEqual(attributeNode.value.code);
	});

	it('method "getOptionLabel" works correctly', () => {
		const component = shallow(<SourceControl {...getProps()} />).instance();
		const attribute = getAttribute();

		expect(component.getOptionLabel(attribute)).toEqual(attribute.title);
		expect(component.getOptionLabel(null)).toEqual('');
	});

	it('method "getOptionValue" works correctly', () => {
		const component = shallow(<SourceControl {...getProps()} />).instance();
		const attribute = getAttribute();

		expect(component.getOptionValue(attribute)).toEqual(attribute.code);
		expect(component.getOptionLabel(null)).toEqual('');
	});

	it('method "isDisabled" works correctly', () => {
		const component = shallow(<SourceControl {...getProps()} />).instance();
		const sourceId = 'dataKey';
		const sourceNode = getNode({id: sourceId, value: getSource()});
		const attributeNode = getNode({parent: sourceId, value: getAttribute()});

		expect(component.isDisabled(sourceNode)).toEqual(true);
		expect(component.isDisabled(attributeNode)).toEqual(false);
	});

	it('method "isSelected" works correctly', () => {
		const component = shallow(<SourceControl {...getProps()} />).instance();
		const sourceId = 'dataKey';
		const sourceNode = getNode({id: sourceId, value: getSource()});
		const attributeNode = getNode({parent: sourceId, value: getAttribute()});

		expect(component.isSelected(sourceNode)).toEqual(false);
		expect(component.isSelected(attributeNode)).toEqual(true);
	});
})
