function sum(a, b) {
  return console.log(a + b);
}

function foo() {
  console.log('foo');
}

sum(3, 5);
sum('abc', 33);

setTimeout(foo, 1000);

/*setTimeout(, 1000);*/

a = foo();
b = foo;
