// @flow
import 'jest';
import {addElement, insertElement, replaceElement, removeElement} from 'helpers';

declare var describe: Function;
declare var it: Function;
declare var expect: Function;

describe('Array helpers', () => {
	it('removeElement', () => {
		const arr = [];

		expect(removeElement(arr, 0)).toEqual([]);
		expect(removeElement(arr, -1)).toEqual([]);
		expect(removeElement(arr, 1)).toEqual([]);
	});

	it('removeElement', () => {
		const arr = [1];

		expect(removeElement(arr, 1)).toEqual([1]);
		expect(removeElement(arr, -1)).toEqual([1]);
		expect(removeElement(arr, 2)).toEqual([1]);
	});

	it('removeElement', () => {
		const arr = [1, 2, 3];

		expect(removeElement(arr, 0)).toEqual([2, 3]);
		expect(removeElement(arr, 1)).toEqual([1, 3]);
		expect(removeElement(arr, 2)).toEqual([1, 2]);
		expect(removeElement(arr, 3)).toEqual([1, 2, 3]);
	});

	it('addElement', () => {
		const arr = [];

		expect(addElement(arr, 0)).toEqual([0]);
		expect(addElement(arr, 1)).toEqual([1]);
	});

	it('addElement', () => {
		const arr = [1,2,3];

		expect(addElement(arr, 1)).toEqual([1,2,3,1]);
		expect(addElement(arr, 2)).toEqual([1,2,3,2]);
	});

	it('replaceElement', () => {
		const arr = [];

		expect(replaceElement(arr, 0, 1)).toEqual([]);
		expect(replaceElement(arr, 1, 1)).toEqual([]);
	});

	it('replaceElement', () => {
		const arr = [1,2,3];

		expect(replaceElement(arr, 0, 1)).toEqual([1,2,3]);
		expect(replaceElement(arr, 1, 1)).toEqual([1,1,3]);
		expect(replaceElement(arr, 2, 1)).toEqual([1,2,1]);
		expect(replaceElement(arr, 3, 1)).toEqual([1,2,3]);
	});

	it('insertElement', () => {
		const arr = [];

		expect(insertElement(arr, 0, 1)).toEqual([1]);
		expect(insertElement(arr, 1, 1)).toEqual([1]);
	});

	it('insertElement', () => {
		const arr = [1,2,3];

		expect(insertElement(arr, 0, 1)).toEqual([1,1,2,3]);
		expect(insertElement(arr, 1, 1)).toEqual([1,1,2,3]);
		expect(insertElement(arr, 2, 1)).toEqual([1,2,1,3]);
		expect(insertElement(arr, 3, 1)).toEqual([1,2,3,1]);
	});
});
