// @flow
import type {DiagramBuildData} from 'store/widgets/buildData/types';
import type {PivotColumn, PivotSeriesData} from './types';
import type {PivotWidget} from 'store/widgets/data/types';

export const parseColumns = (widget: PivotWidget, rawData: DiagramBuildData): Array<PivotColumn> => [];

export const getColumnWidth = (columns: Array<PivotColumn>, container: HTMLDivElement): number => 150;

export const getSeriesData = (rawData: DiagramBuildData): PivotSeriesData => [];
