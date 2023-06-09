// @flow
import commonCase from './__cases__/circle/common.json';
import {compareFormatter} from './helpers';
import formatsCase from './__cases__/circle/formats.json';
import {getCircleFormatter} from 'utils/recharts/formater';

const makeCircleCase = (data: Object) => {
	const {container, labels, widget} = data;
	const formatter = getCircleFormatter(widget, labels, container);

	compareFormatter(data.breakdown, formatter.breakdown);
	compareFormatter(data.dataLabel, formatter.dataLabel);
	compareFormatter(data.legend, formatter.legend);
	compareFormatter(data.tooltip, formatter.tooltip);
};

describe('Circle cases test', () => {
	it('общий кейс', () => makeCircleCase(commonCase));
	it('С форматированием', () => makeCircleCase(formatsCase));
});
