var getMessage = function(a, b) {
    var typeofa = typeof a;
    var typeofb = typeof b;
    var lenght, maslength, sum, i;

    if (typeofa === 'boolean') {
      if (a === true) {
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
        sum = sum + a[i];
      }

      return 'Я прошел ' + sum + ' шагов';
    } else if (typeofa === 'object' && typeofb === 'object') {
        lenght = 0;

        a.length > b.length ? maslength = b.length : maslength = a.length;

        for (i = 0; i < maslength; i++) {
          lenght = lenght + (a[i] * b[i]);
        }

        return 'Я прошел ' + lenght + ' Метров';
    }
};
