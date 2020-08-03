import * as React from 'react';

const style: React.CSSProperties = {
    height: 75,
    width: 75
}

const nullStyle: React.CSSProperties = {
    ...style,
    backgroundColor: 'transparent'
}

const oStyle: React.CSSProperties = {
    ...style,
    borderRadius: '50%',
    backgroundColor: 'lightgrey'
}

const xStyle: React.CSSProperties = {
    ...oStyle,
    backgroundColor: 'darkgrey'
}

export type CellProps = {
    cell: 'O' | 'X' | null,
    rowIndex: number,
    columnIndex: number,
    onClick: (rowIndex: number, columnIndex: number) => void
}

export const Cell = React.memo(({ cell, onClick, rowIndex, columnIndex }: CellProps) => {
    const handleClick = React.useCallback(() => onClick(rowIndex, columnIndex), [onClick, rowIndex, columnIndex])

    return cell === null
        ? (
            <button
                type='button'
                style={nullStyle}
                onClick={handleClick}
            >
                {cell}
            </button >
        ) : (
            <div style={cell === 'O' ? oStyle : xStyle} />
        );
});
