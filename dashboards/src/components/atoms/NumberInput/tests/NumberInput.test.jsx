import {getProps} from './helpers';
import NumberInput from 'components/atoms/NumberInput';
import React from 'react';
import {shallow, mount} from 'enzyme';


describe('NumberInput component', () => {

	it('default renders', () => {
		const wrapper = shallow(<NumberInput {...getProps()} />);

		expect(wrapper).toMatchSnapshot();
	});

	it('renders with value', () => {
		const wrapper = shallow(<NumberInput {...getProps()} value={3} />);
		expect(wrapper.find('.input').prop('value')).toBe(3)
	});

	it('input text', () => {
		const mockOnChange = jest.fn();
		const wrapper = mount(<NumberInput {...getProps()} onChange={mockOnChange}/>);

		wrapper.find('TextInput').instance().handleChange({currentTarget: { value: '19' }});
		expect(mockOnChange).toHaveBeenCalledWith({name: "name", value: 19});
	});

	it('click events', () => {
		const mockOnChange = jest.fn();
		const wrapper = shallow(<NumberInput {...getProps()} value={1} onChange={mockOnChange}/>);

		wrapper.find('IconButton').find('[icon="PLUS"]').simulate('click')
		expect(mockOnChange).toHaveBeenCalledWith({name: "name", value: 2});

		wrapper.find('IconButton').find('[icon="MINUS"]').simulate('click')
		expect(mockOnChange).toHaveBeenCalledWith({name: "name", value: 0});
	});

	it('max/min props', () => {
		const mockOnChange = jest.fn();
		const wrapper = shallow(<NumberInput {...getProps()} value={5} max={0} min={5} onChange={mockOnChange}/>);

		wrapper.find('IconButton').find('[icon="PLUS"]').simulate('click')
		expect(mockOnChange).not.toHaveBeenCalled()

		wrapper.setProps({value: 0});
		wrapper.find('IconButton').find('[icon="MINUS"]').simulate('click')

		expect(mockOnChange).not.toHaveBeenCalled()
	});

	it('input and max/min props', () => {
		const mockOnChange = jest.fn();
		const wrapper = mount(<NumberInput {...getProps()} max={2} min={5} onChange={mockOnChange}/>);

		wrapper.find('TextInput').instance().handleChange({currentTarget: { value: '6' }});
		expect(mockOnChange).not.toHaveBeenCalled();

		wrapper.find('TextInput').instance().handleChange({currentTarget: { value: '1' }});
		expect(mockOnChange).not.toHaveBeenCalled();
	});

	it('contorls element', () => {
		const controls = {
			ContolsContainer: () => (<div className="noContols"></div>)
		}
		const wrapper = mount(<NumberInput {...getProps()} controls={controls}/>);
		expect(wrapper).toMatchSnapshot();

		const iconButton = wrapper.exists('IconButton');
		expect(iconButton).not.toBeTruthy();

		const noContols = wrapper.exists('.noContols');
		expect(noContols).toBeTruthy();
	});


});
