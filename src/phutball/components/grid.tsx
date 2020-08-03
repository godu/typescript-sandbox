import * as React from 'react';
import { Cell, CellProps } from './cell';

const style: React.CSSProperties = {
    display: 'grid',
    gridTemplateRows: 'repeat(21, 1fr)',
    gridTemplateColumns: 'repeat(15, 1fr)',
    gridGap: 2,
}

export type GridProps = {
    grid: CellProps['cell'][][],
    onClick: (rowIndex: number, columnIndex: number) => void
}

export const Grid = React.memo(({ grid, onClick }: GridProps) => (
    <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-block' }}>
            <div style={style}>
                {grid.map((row, rowIndex) =>
                    row.map((cell, columnIndex) => (
                        <Cell
                            key={`${rowIndex}-${columnIndex}`}
                            rowIndex={rowIndex}
                            columnIndex={columnIndex}
                            cell={cell}
                            onClick={onClick}
                        />
                    ))
                )}
            </div>
        </div>
    </div>
));
