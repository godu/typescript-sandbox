
async function* of<A>(iterable: Iterable<A>) {
  for (const item of iterable) {
    yield item;
  }
}

async function* map<A, B>(fun: (a: A) => B, asyncIterable: AsyncIterable<A>) {
  for await (const item of asyncIterable) {
    yield fun(item);
  }
}

async function* take<A>(count: number, asyncIterable: AsyncIterable<A>) {
  let i = 0;
  for await (const item of asyncIterable) {
    if (i === count )return;
    yield item;
    i = i + 1;
  }
}

const arr = function* () {
  let i = 0;
  while(true){
    yield i;
    i++;
  }
};

const result = map(
  i => i * 2,
  of(arr())
);

(async () => {
  for await (const item of take(2, result)) {
    console.log({item});
  }
})()