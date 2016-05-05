'use strict';

var getMessage = function(a, b) {
  var typeofa = typeof a;
  var typeofb = typeof b;
  var length, arrlength, sum, i;

  if (typeofa === 'boolean') {
    if (a) {
      return 'Я попал в ' + b;
    } else {
      return 'Я никуда не попал';
    }
  }

  if (typeofa === 'number') {
    return 'Я прыгнул на ' + a * 100 + ' сантиметров';
  }

  if (typeofa === 'object' && typeofb !== 'object') {
    sum = 0;

    for (i = 0; i < a.length; i++) {
      sum += a[i];
    }

    return 'Я прошёл ' + sum + ' шагов';
  } else if (typeofa === 'object' && typeofb === 'object') {
    length = 0;

    arrlength = Math.max(a.length, b.length);

    for (i = 0; i < arrlength; i++) {
      length += (a[i] * b[i]);
    }

    return 'Я прошёл ' + length + ' метров';
  }
};
