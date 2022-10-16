export function computedYear(dateBirth) {
  var today = new Date();
  //Restamos los años
  let year = dateBirth.getFullYear();
  year = today.getFullYear() - year;
  // Si no ha llegado su cumpleaños le restamos el año por cumplir
  if (dateBirth.getMonth() > (today.getMonth()) || dateBirth.getDay() > today.getDay())
    year--;
  return year;
}
