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

// ------------------------------------------------------------------------

log = console.log;
toInteger = n => n(x => x + 1, 0);
toBool = b => b(true, false);
toArray = l => l((a, b) => [a].concat(b), []);

log("numbers", [ one, two, three, four, five ].map(toInteger));
log("5 - 3 =", toInteger(sub(five, three)));
log("5 * 3 =", toInteger(mul(five, three)));
log("");
log("1 > 2 =", toBool(greater(one, two)));
log("2 > 2 =", toBool(greater(two, two)));
log("2 > 1 =", toBool(greater(two, one)));
log("4 > 5 =", toBool(greater(four, five)));
log("5 > 0 =", toBool(greater(five, nil)));
log("");
log("0 == 0 =", toBool(equals(nil, nil)));
log("0 == 5 =", toBool(equals(nil, five)));
log("1 == 2 =", toBool(equals(one, two)));
log("5 == 4 =", toBool(equals(five, four)));
log("5 == 5 =", toBool(equals(five, five)));

truthTable = (op, f) => {
    [[n, n], [n, y], [y, n], [y, y]].map(x => {
        log(x.map(toBool).map(x => x.toString()).join(" " + op + " "),
            "=", toBool(f(x[0], x[1])));
    });
};

log("");
truthTable("||", or);
truthTable("&&", and);

log("");
console.log("times 5");
times(five, x => log(toInteger(x)));

log("");
console.log("range 1 3");
range(one, three, x => log(toInteger(x)));

log("");
l = nil;
l = prepend(l, five);
l = prepend(l, five);
l = prepend(l, five);
l = prepend(l, four);
l = prepend(l, three);
l = prepend(l, two);
l = prepend(l, one);
log("l =", toArray(l).map(toInteger));
log("first(l) =", toInteger(first(l)));
console.log("l = rest(l)");
l = rest(l);
log("first(l) =", toInteger(first(l)));
log("nth(l, 2) =", toInteger(nth(l, two)));
