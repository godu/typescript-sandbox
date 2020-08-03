import * as React from 'react';
import { render } from 'react-dom';
import {
  __,
  get,
  pipe,
  random,
  shuffle,
  sortBy,
  times,
  map,
  join,
  mapValues,
  size,
  uniqueId,
  groupBy
} from 'lodash/fp';
import { range } from 'd3';

type Player = {
  name: string;
  strenght: number;
  rating: number;
}

const createPlayer = (): Player => ({
  name: uniqueId('Player_'),
  strenght: random(0, 100),
  rating: 1200
});

let PLAYERS = times(createPlayer)(500)

const PlayerItem = (player: Player) => (
  <span>
    <strong>{`${player.rating}`.padStart(4, ' ')}</strong> <span>{player.name}</span> <i>{`(${player.strenght})`}</i>
  </span>
);

const PlayerList = ({ players }: { players: Player[] }) => (
  <ol style={{ margin: 0 }}>
    {players.map(player =>
      <li key={player.name} >
        <PlayerItem {...player} />
      </li>
    )}
  </ol>
);

const toss = (playerA: Player, playerB: Player): [1, 0] | [0.5, 0.5] | [0, 1] => {
  const result = random(-playerA.strenght, playerB.strenght);
  return result === 0
    ? [0.5, 0.5]
    : result < 0
      ? [1, 0]
      : [0, 1];
}

const getExpectedScore = (playerA: Player, playerB: Player) =>
  1 / (1 + Math.pow(10, (playerB.rating - playerA.rating) / 400))

const sortByRating = sortBy(pipe(get('rating'), (x: number) => -x))

const nextRating = (rating: number, result: 1 | 0.5 | 0, estimatedResult: number, K: number) =>
  rating + Math.round(K * (result - estimatedResult));

const nextGeneration = (players: Player[]): Player[] => {
  const [playerA, playerB, ...nextPlayers] = shuffle(players);

  const eA = getExpectedScore(playerA, playerB);
  const eB = getExpectedScore(playerB, playerA);

  const K = 10;

  const [resultPlayerA, resultPlayerB] = toss(playerA, playerB);

  return [{
    ...playerA,
    rating: nextRating(playerA.rating, resultPlayerA, eA, K)
  }, {
    ...playerB,
    rating: nextRating(playerB.rating, resultPlayerB, eB, K)
  }, ...nextPlayers];
};

const Histogram = ({ values }: { values: number[] }) => {
  const max = Math.max(...values);

  return (
    <div>
      {
        pipe(
          map(pipe(times(() => "#"), join(''))),
          map(v => (<div>{v}</div>))
        )(values)
      }
    </div>
  );
}

const Distribution = ({ values }: { values: number[] }) => {
  const LINES = 100;

  const max = Math.max(...values);
  const min = Math.min(...values);
  const vs = pipe(
    groupBy((v: number) => Math.floor(v * LINES / max)),
    mapValues(size)
  )(values);

  return (
    <Histogram values={map(
      (i: number) => get(i, vs)
    )(
      range(
        Math.floor(min * LINES / max),
        Math.ceil(max * LINES / max)
      )
    )} />
  );
}

setInterval(() => {
  PLAYERS = sortByRating(nextGeneration(PLAYERS))
}, 0);

const loop = () => {
  requestAnimationFrame(() => {
    render(
      <>
        <h1>ELO rating system</h1>
        <h2>Distribution</h2>
        <Distribution values={PLAYERS.map(p => p.rating)} />
        <h2>Leaderboard</h2>
        <div style={{ display: "flex" }}>
          <br />
          <PlayerList players={PLAYERS} />
          <Histogram values={PLAYERS.map(p => p.strenght)} />
        </div >
      </>,
      document.getElementById('app')
    );
    setTimeout(loop, 1000);
  });
};

loop();
