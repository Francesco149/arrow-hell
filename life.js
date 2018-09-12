/*
 * the concept of representing anything as a function blew my mind so
 * I decided to play with it and implement the game of life only using
 * lambda primitives
 *
 * in number.js you can find tests for a bunch of lambda primitives I
 * put together
 *
 * the only reason I used js is that it has a nice short syntax for
 * closures and I already had node installed
 */

nil = (f, x) => x;
succ = n => (f, x) => f(n(f, x));
add = (a, b) => (f, x) => a(f, b(f, x));
mul = (a, b) => b(n => add(a, n), nil);
mkPair = (a, b) => f => f(a, b);
fst = p => p((a, b) => a);
snd = p => p((a, b) => b);
pred = n => fst(n(p => mkPair(snd(p), succ(snd(p))), mkPair(nil, nil)));
sub = (a, b) => b(n => pred(n), a);
y = (a, b) => a;
n = (a, b) => b;
if_ = (cond, then, else_) => cond(then, else_)();
elif = (cond, then, else_) => () => if_(cond, then, else_);
not = b => b(n, y);
and = (a, b) => a(b(y, n), n);
or = (a, b) => a(y, b(y, n));
greaterEqual = (a, b) =>
    fst(sub(succ(a), b)(p => mkPair(snd(p), snd(p)), mkPair(n, y)));
greater = (a, b) => greaterEqual(a, succ(b));
less = (a, b) => not(greaterEqual(a, b));
equals = (a, b) => and(not(greater(a, b)), not(less(a, b)));
times = (num, step) => num(x => n(step(sub(num, x)), pred(x)), num);
range = (a, b, step) => times(succ(sub(b, a)), n => step(add(n, a)));
prepend = (l, i) => (f, x) => f(i, l(f, x));
first = l => l((a, b) => a, nil);
rest = l =>
    fst(l((a, b) => mkPair(snd(b), prepend(snd(b), a)), mkPair(nil, nil)));
nth = (l, n) => first(n(x => rest(x), l));

one = succ(nil);
two = add(one, one);
three = add(one, two);
four = add(two, two);
five = add(four, one);
twelve = mul(four, three);
fourteen = add(twelve, two);

getIndex = (x, y) =>
    sub(pred(mul(fourteen, fourteen)),
        add(mul(succ(y), fourteen), succ(x)));

neighbours = i =>
    add(
        add(
            add(add(nth(world, pred(sub(i, fourteen))),
                    nth(world, sub(i, fourteen))),
                nth(world, succ(sub(i, fourteen)))),
            add(nth(world, pred(i)), nth(world, succ(i)))
        ),
        add(add(nth(world, pred(add(i, fourteen))),
                nth(world, add(i, fourteen))),
            nth(world, succ(add(i, fourteen))))
    );

lifeTick = (world) => {
    newWorld = nil;

    times(fourteen, x => {
        newWorld = prepend(newWorld, nil);
    });

    times(twelve, y => {
        newWorld = prepend(newWorld, nil);
        times(twelve, x => {
            near = neighbours(getIndex(x, y));
            c = if_(less(near, two),
                    () => nil,
                elif(less(near, four),
                    () => if_(or(equals(nth(world, getIndex(x, y)), one),
                                 equals(near, three)),
                              () => one,
                          () => nil),
                    () => nil));
            newWorld = prepend(newWorld, c);
        });
        newWorld = prepend(newWorld, nil);
    });

    times(fourteen, x => {
        newWorld = prepend(newWorld, nil);
    });

    return newWorld;
};

world = nil;
G = one;
_ = nil;
p = (v) => world = prepend(world, v);

p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(G),p(G),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(G),p(G),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(G),p(G),p(G),p(_),p(_),p(_),p(_),p(G),p(G),p(_);
p(_),p(_),p(_),p(G),p(G),p(G),p(_),p(_),p(_),p(_),p(_),p(G),p(G),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);
p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_),p(_);

// ------------------------------------------------------------------------

// these are the only non-lambda primitives, required to print the state
// of the screen
log = console.log;
toInteger = n => n(x => x + 1, 0);
toArray = l => l((a, b) => [a].concat(b), []);
draw = () => {
    process.stdout.write("\x1B[2J\x1B[0f");
    toArray(world)
        .map(toInteger)
        .reduce((s, x) => s + x, "")
        .replace(/0/g, " ")
        .replace(/1/g, "#")
        .match(/.{14}/g)
        .map(x => log(x));
};

async function run() {
    for (;;) {
        delay = new Promise(resolve => setTimeout(resolve, 500));
        draw();
        world = lifeTick(world);
        await delay;
    }
}

run();
