
import ReactDOM from 'react-dom';
import { identity } from 'fp-ts/es6/Identity';
import { option } from 'fp-ts/es6/Option';
import { io } from 'fp-ts/es6/IO';
import { task, delay } from 'fp-ts/es6/Task';
import createApp from './bmi';

identity.map(
    createApp(identity)({
        height: identity.of(170),
        weight: identity.of(70)
    }),
    view => ReactDOM.render(view, document.getElementById('identity'))
);

option.map(
    createApp(option)({
        height: option.of(170),
        weight: option.of(70)
    }),
    view => ReactDOM.render(view, document.getElementById('option'))
);

setTimeout(
    io.map(
        createApp(io)({
            height: io.of(170),
            weight: io.of(70)
        }),
        view => ReactDOM.render(view, document.getElementById('io'))
    ),
    1000
);

task.map(
    createApp(task)({
        height: delay(2000)(task.of(170)),
        weight: task.of(70)
    }),
    view => ReactDOM.render(view, document.getElementById('task'))
)();

