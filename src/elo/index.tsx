import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { render } from 'react-dom';
import { range, repeat } from 'lodash/fp';
import * as d3 from 'd3';
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
  <table >
    <thead>
      <tr>
        <th>Rating</th>
        <th>Name</th>
        <th colSpan={2} >Strenght</th>
      </tr>
    </thead>
    <tbody>
      {players.map(player =>
        <tr key={player.name}>
          <td>
            <strong>
              {`${player.rating}`.padStart(4, ' ')}
            </strong>
          </td>
          <td>{player.name}</td>
          <td>{`${player.strenght}`}</td>
          <td>{`${repeat(player.strenght, '|')}`}</td>
        </tr>
      )}
    </tbody>
  </table >
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

const margin = { top: 10, right: 30, bottom: 30, left: 40 };
const width = 460 - margin.left - margin.right;
const height = 400 - margin.top - margin.bottom;

const Histogram = ({ values }: { values: number[] }) => {
  const element = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (element.current === null) return;

    const svg = d3.select(element.current)
      .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    const x = d3.scaleLinear()
      .domain([
        d3.min(values) || 0,
        d3.max(values) || 0
      ])
      .range([0, width]);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));


    const [min = 0, max = 100] = x.domain();
    const histogram = d3.histogram()
      .domain([min, max])
      .thresholds(x.ticks(70));

    const bins = histogram(values);

    const y = d3.scaleLinear()
      .range([height, 0]);
    y.domain([
      0,
      d3.max(bins, function (d) { return d.length; }) || 0
    ]);
    svg.append("g")
      .call(d3.axisLeft(y));

    svg.selectAll("rect")
      .data(bins)
      .enter()
      .append("rect")
      .attr("x", 1)
      .attr("transform", function (d) { return "translate(" + x(d.x0 || 0) + "," + y(d.length) + ")"; })
      .attr("width", function (d) { return x(d.x1 || 0) - x(d.x0 || 0) - 1; })
      .attr("height", function (d) { return height - y(d.length); })
      .style("fill", "#69b3a2")

    return () => {
      d3.select(element.current).select('svg').remove();
    }
  }, [element, values])

  return (
    <div>
      <div ref={element} />
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
    <Histogram values={values} />
  );
}

setInterval(() => {
}, 0);

const loop = () => {
  requestAnimationFrame(() => {
    const start = Date.now();
    while (Date.now() < (start + 20)) {
      PLAYERS = sortByRating(nextGeneration(PLAYERS))
    }
    render(
      <>
        <h1>ELO rating system</h1>
        <h2>Distribution</h2>
        <Distribution values={PLAYERS.map(p => p.rating)} />
        <h2>Leaderboard</h2>
        <div style={{ display: "flex" }}>
          <br />
          <PlayerList players={PLAYERS} />
        </div >
      </>,
      document.getElementById('app')
    );
    loop()
  });
};

loop();
