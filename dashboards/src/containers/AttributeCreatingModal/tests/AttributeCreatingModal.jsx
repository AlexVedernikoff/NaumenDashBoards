import {AttributeCreatingModalContainer} from 'containers/AttributeCreatingModal/AttributeCreatingModalContainer';
import React from 'react';
import {shallow} from 'enzyme';
import {getAttribute} from 'components/organisms/AttributeCreatingModal/components/SourceControl/tests/helpers';
import {getNode} from 'src/components/molecules/TreeSelect/components/Node/tests/helpers';
import {getProps} from './helpers';

describe('AttributeCreatingModalContainer', () => {
	it('method "getOptions" returns a tree containing sources as roots and attributes as child nodes', () => {
		const props = getProps();
		const attribute = getAttribute();
		const {dataKey, source} = props.values.data[0];
		const attributes = {
			[source.value.value]: {
				loading: false,
				options: [attribute]
			}
		};
		const wrapper = shallow(<AttributeCreatingModalContainer {...props} attributes={attributes} />);
		const attributeNodeId = `${dataKey}$${attribute.code}`;
		const sourceNode = getNode({children: [attributeNodeId], id: dataKey, value: source.value});
		const attributeNode = getNode({id: attributeNodeId, parent: dataKey, value: attribute});

		expect(wrapper.instance().getOptions(props.values, attributes)).toMatchObject({
			[sourceNode.id]: sourceNode,
			[attributeNodeId]: attributeNode
		});
	});
})
