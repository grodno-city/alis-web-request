import { getBooksByYear } from './index';

// 'type' is a books type. in alis-web used name 'tema'. 6-"книги".
// There is a 8 types:
// 'All' - 'все типы'
// 1 - 'Книги'
// 2 - "Статьи"
// 3 - "Краеведение"
// 4 - "Ноты"
// 5 - "Авторефераты Диссертаций"
// 6 - "Аудиовизуальные документы"
// 7 - "Электронные документы"
// 8 - "Периодика"
getBooksByYear(2017, 1, (err, memo) => {
  console.log('memo.length All: ', memo.length);
});
