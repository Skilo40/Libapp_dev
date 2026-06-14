import 'dotenv/config';
import mongoose from 'mongoose';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import User from '../models/User.js';

// Підключення до БД
await mongoose.connect(process.env.MONGODB_URI);
console.log('Підключено до MongoDB...');

const admin = await User.findOne({ email: 'admin@library.com' });
if (!admin) {
  console.log('Спочатку створіть адміна: npm run create-admin');
  process.exit(1);
}

const booksCount = await Book.countDocuments();
if (booksCount > 0) {
  console.log(`Книги вже є в базі (${booksCount} шт.). Пропускаємо.`);
} else {
  const booksToInsert = [
    {
      title: 'Кобзар',
      author: 'Тарас Шевченко',
      isbn: '978-966-03-0006-1',
      genre: 'Поезія',
      year: 1840,
      bookLanguage: 'Українська',
      pages: 320,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Kobzar_1840.jpg',
      description: '«Кобзар» — назва збірки поетичних творів Тараса Шевченка. Це фундаментальна праця, яка стала символом українського національного відродження. У своїх віршах автор розкриває теми соціальної несправедливості, любові до України, історичного минулого та героїчної боротьби народу за свою свободу.',
      totalCopies: 5,
      availableCopies: 5,
      addedBy: admin._id,
    },
    {
      title: 'Лісова пісня',
      author: 'Леся Українка',
      isbn: '978-966-03-0007-2',
      genre: 'Драма-феєрія',
      year: 1911,
      bookLanguage: 'Українська',
      pages: 128,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Lisova_pisnia_1914_cover.jpg/800px-Lisova_pisnia_1914_cover.jpg',
      description: 'Драма-феєрія в трьох діях, один із найвидатніших творів Лесі Українки. У п\'єсі розкривається конфлікт між високим ідеалом і дріб\'язковою буденністю через історію кохання лісової німфи Мавки та звичайного сільського парубка Лукаша. Твір багатий на фольклорні та міфологічні мотиви.',
      totalCopies: 4,
      availableCopies: 4,
      addedBy: admin._id,
    },
    {
      title: 'Тіні забутих предків',
      author: 'Михайло Коцюбинський',
      isbn: '978-966-03-0008-3',
      genre: 'Повість',
      year: 1911,
      bookLanguage: 'Українська',
      pages: 96,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Tini_zabutyh_predkiv.jpg',
      description: 'Трагічна історія кохання Івана та Марічки, які належать до двох ворогуючих гуцульських родів (українські Ромео і Джульєтта). Повість глибоко занурює в атмосферу Карпатських гір, знайомлячи читача з побутом, звичаями, демонологією та первісними віруваннями гуцулів.',
      totalCopies: 3,
      availableCopies: 3,
      addedBy: admin._id,
    },
    {
      title: 'Місто',
      author: 'Валер\'ян Підмогильний',
      isbn: '978-966-03-0009-4',
      genre: 'Роман',
      year: 1928,
      bookLanguage: 'Українська',
      pages: 288,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/4/44/Misto-1928-1ed-cover.jpg',
      description: 'Перший урбаністичний роман в українській літературі. Головний герой, сільський юнак Степан Радченко, приїжджає до Києва на навчання. Роман психологічно тонко змальовує еволюцію героя, його злети і падіння, боротьбу між ідеалами та жорстокими реаліями великого міста.',
      totalCopies: 2,
      availableCopies: 2,
      addedBy: admin._id,
    },
    {
      title: 'Тигролови',
      author: 'Іван Багряний',
      isbn: '978-617-8734-01-5',
      genre: 'Пригодницький роман',
      year: 1944,
      bookLanguage: 'Українська',
      pages: 416,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/0/02/Tyhrolovy_cover.jpeg',
      description: 'Динамічний пригодницький роман про українського юнака Григорія Многогрішного, який тікає з ешелону смерті на Далекому Сході. Твір є справжнім гімном незламності людського духу, волелюбності та здатності вижити і зберегти людяність навіть у найжорстокіших умовах сталінського терору.',
      totalCopies: 4,
      availableCopies: 4,
      addedBy: admin._id,
    },
    {
      title: 'Кайдашева сім\'я',
      author: 'Іван Нечуй-Левицький',
      isbn: '978-617-8248-76-5',
      genre: 'Повість',
      year: 1879,
      bookLanguage: 'Українська',
      pages: 264,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/95/Kajdasheva_Simia.jpg',
      description: 'Соціально-побутова повість, яка через призму однієї родини Кайдашів геніально та з іскрометним гумором показує життя українського села після скасування кріпацтва. Конфлікти між батьками та дітьми, свекрухою та невістками розкривають глибинні проблеми суспільства.',
      totalCopies: 6,
      availableCopies: 6,
      addedBy: admin._id,
    },
    {
      title: 'Інтернат',
      author: 'Сергій Жадан',
      isbn: '978-966-97679-0-5',
      genre: 'Сучасна проза',
      year: 2017,
      bookLanguage: 'Українська',
      pages: 336,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/7/75/Internat_cover.jpeg',
      description: 'Пронзливий роман про війну на сході України. Головний герой, шкільний вчитель Паша, вирушає в охоплене боями місто, щоб забрати свого племінника з інтернату. Це подорож крізь зруйновані вулиці, людські страхи та пошук власної ідентичності в умовах апокаліпсису.',
      totalCopies: 5,
      availableCopies: 5,
      addedBy: admin._id,
    },
    {
      title: 'Тореадори з Васюківки',
      author: 'Всеволод Нестайко',
      isbn: '978-966-7047-86-3',
      genre: 'Дитяча література',
      year: 1973,
      bookLanguage: 'Українська',
      pages: 544,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/8/86/Toreadory_z_Vasyukivky.jpg',
      description: 'Культова дитяча книга, що розповідає про неймовірні та кумедні пригоди двох нерозлучних друзів — Яви Реня та Павлуші Завгороднього. Вони постійно вигадують якісь грандіозні плани: то будують метро під свинарником, то влаштовують бій биків. Книга, на якій виросло не одне покоління.',
      totalCopies: 8,
      availableCopies: 8,
      addedBy: admin._id,
    },
    {
      title: '1984',
      author: 'Джордж Орвелл',
      isbn: '978-617-509-000-5',
      genre: 'Антиутопія',
      year: 1949,
      bookLanguage: 'Українська',
      pages: 328,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/4/43/1984_first_edition_cover.jpg',
      description: 'Один із найвідоміших антиутопічних романів у світовій літературі. Твір малює жахливу картину тоталітарного суспільства Океанії, де держава контролює не лише дії, а й думки кожної людини через "поліцію думок" та Великого Брата, який "стежить за тобою".',
      totalCopies: 5,
      availableCopies: 5,
      addedBy: admin._id,
    },
    {
      title: 'Майстер і Маргарита',
      author: 'Михайло Булгаков',
      isbn: '978-966-03-0010-5',
      genre: 'Містичний реалізм',
      year: 1967,
      bookLanguage: 'Українська',
      pages: 480,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/9/91/Master_i_margarita.jpg',
      description: 'Багатошаровий містичний роман, у якому переплітаються три сюжетні лінії: пришестя Диявола (Воланда) з його почтом до атеїстичної Москви 30-х років, історія безмежного кохання Майстра та Маргарити, а також переосмислена біблійна історія про Понтія Пілата та Ієшуа.',
      totalCopies: 3,
      availableCopies: 3,
      addedBy: admin._id,
    },
    {
      title: 'Маленький принц',
      author: 'Антуан де Сент-Екзюпері',
      isbn: '978-966-03-0011-6',
      genre: 'Казка-притча',
      year: 1943,
      bookLanguage: 'Українська',
      pages: 96,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/3/30/Le_Petit_Prince_cover.jpg',
      description: 'Філософська казка-притча, яка через прості та зворушливі образи розповідає про найважливіші речі в житті: дружбу, любов, вірність та відповідальність за тих, кого ми приручили. Твір написаний для дітей, але має глибокий сенс, зрозумілий лише дорослим.',
      totalCopies: 7,
      availableCopies: 7,
      addedBy: admin._id,
    },
    {
      title: 'Гаррі Поттер і філософський камінь',
      author: 'Дж. К. Роулінг',
      isbn: '978-966-917-218-3',
      genre: 'Фентезі',
      year: 1997,
      bookLanguage: 'Українська',
      pages: 320,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/b/b4/Harry_Potter_and_the_Sorcerer%27s_Stone_Book_Cover_Ukr.jpg',
      description: 'Перша книга про хлопчика-сироту Гаррі Поттера, який дізнається, що він насправді могутній чарівник. Він вирушає на навчання до школи магії Гоґвортс, де знаходить вірних друзів, розкриває таємниці свого минулого та вперше стикається з темним чаклуном Волдемортом.',
      totalCopies: 10,
      availableCopies: 10,
      addedBy: admin._id,
    },
    {
      title: 'Дюна',
      author: 'Френк Герберт',
      isbn: '978-617-12-3323-2',
      genre: 'Наукова фантастика',
      year: 1965,
      bookLanguage: 'Українська',
      pages: 656,
      coverUrl: 'https://upload.wikimedia.org/wikipedia/uk/1/13/Dune-Frank_Herbert.jpeg',
      description: 'Епічний науково-фантастичний роман, дія якого розгортається в далекому майбутньому на пустельній планеті Арракіс. Це єдине місце у Всесвіті, де видобувають найціннішу речовину — «прянощі» (спайс). Книга піднімає глибокі екологічні, політичні та релігійні теми.',
      totalCopies: 4,
      availableCopies: 4,
      addedBy: admin._id,
    }
  ];

  await Book.insertMany(booksToInsert);
  console.log(`Книги додано успішно! (${booksToInsert.length} шт.)`);
}

const membersCount = await Member.countDocuments();
if (membersCount > 0) {
  console.log(`Читачі вже є в базі (${membersCount} шт.). Пропускаємо.`);
} else {
  await Member.insertMany([
    {
      firstName: 'Іван',
      lastName: 'Петренко',
      email: 'ivan@example.com',
      phone: '+380991234567',
      isActive: true,
    },
    {
      firstName: 'Марія',
      lastName: 'Коваленко',
      email: 'maria@example.com',
      phone: '+380991234568',
      isActive: true,
    },
    {
      firstName: 'Олег',
      lastName: 'Сидоренко',
      email: 'oleg@example.com',
      phone: '+380991234569',
      isActive: true,
    },
    {
      firstName: 'Олена',
      lastName: 'Бойко',
      email: 'olena@example.com',
      phone: '+380991234570',
      isActive: true,
    },
  ]);
  console.log('Читачів додано успішно!');
}

console.log('Дані успішно завантажено!');
await mongoose.disconnect();