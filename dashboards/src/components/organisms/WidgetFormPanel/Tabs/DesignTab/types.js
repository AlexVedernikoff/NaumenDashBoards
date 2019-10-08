// @flow

export type State = {
	colors: Array<string>,
	currentColor: string,
	indexColor: number,
	pallete: boolean
}

declare type ElementEventTemplate<E> = {
  target: E
} & Event;

export type DomEvent = ElementEventTemplate<HTMLInputElement>;
