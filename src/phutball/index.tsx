import * as React from 'react';
import { render } from "react-dom";
import { pipe, set } from 'lodash/fp';
import { Grid } from './components/grid';

let state = pipe(
    set([9, 7], 'X'),
    set([10, 7], 'O'),
    set([11, 7], 'X'),
)(Array(21).fill(null).map(() => Array(15).fill(null)))

const update = () => {
    render(
        <Grid grid={state} onClick={handleClick} />,
        document.getElementById('app')
    )

};

const handleClick = (rowIndex: number, columnIndex: number) => {
    state = set([rowIndex, columnIndex], 'X')(state);

    update();
}

update();
