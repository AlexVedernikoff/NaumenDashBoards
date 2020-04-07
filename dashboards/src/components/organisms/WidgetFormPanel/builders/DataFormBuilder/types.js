// @flow
import type {Node} from 'react';

export type RenderFunction = (index: number, ...otherProps: Array<any>) => Node;
