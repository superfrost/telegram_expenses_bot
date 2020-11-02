CREATE TABLE amount(
  name INTEGER NOT NULL
);
CREATE TABLE allowed_users(
  user_id INTEGER PRIMARY KEY NOT NULL,
  name TEXT NOT NULL
);
CREATE TABLE category(
  name TEXT PRIMARY KEY NOT NULL,
  important INTEGER NOT NULL,
  alias TEXT
);
CREATE TABLE expenses (
  id INTEGER PRIMARY KEY NOT NULL,
  date TEXT NOT NULL,
  amount INTEGER NOT NULL,
  info TEXT NOT NULL,
  who INTEGER NOT NULL REFERENCES allowed_users(user_id),
  category TEXT REFERENCES category(name)
);

INSERT INTO amount(name) VALUES(20000);

INSERT INTO allowed_users(user_id, name) VALUES(1148338977, 'Anton');
INSERT INTO allowed_users(user_id, name) VALUES(1288969133, 'Lera');

INSERT INTO category(name, important, alias) VALUES('products', 1, 'prod, food, eat, eats, burger, kfc, mac, products');
INSERT INTO category(name, important, alias) VALUES('transport', 1, 'taxi, troika, metro, bus, train, plane, proezd, transport, travel');
INSERT INTO category(name, important, alias) VALUES('phone', 1, 'mts, phone, wifi, wi-fi, internet');
INSERT INTO category(name, important, alias) VALUES('clothes', 0, 'clothes, dress, clothes, zola, ostin, gloria');
INSERT INTO category(name, important, alias) VALUES('ecomerse', 0, 'ali, aliexpres, aliexpress, Wildberries, wb, ozon, eshop');
INSERT INTO category(name, important, alias) VALUES('other', 0, 'any');

-- This commands are not nessessery. It's only for testing purposes.
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-31 20:14:41',350,'taxi to home',1148338977,'transport');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-30 10:10:11',250,'phone',1148338977,'phone');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-29 19:12:22',700,'products',1148338977,'products');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-28 15:15:12',1000,'shirt for work',1148338977,'clothes');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-28 15:14:24',340,'fixprice',1148338977,'other');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-26 22:29:41',670,'ali',1148338977,'ecomerse');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-25 19:10:37',640,'products',1148338977,'products');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-23 13:14:51',350,'burger',1148338977,'products');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-23 13:14:11',100,'kfc',1148338977,'products');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-20 20:16:42',830,'wifi',1148338977,'phone');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-20 20:14:31',500,'birthday Kolija',1148338977,'other');
INSERT INTO expenses(date, amount, info, who, category) VALUES('2020-10-11 21:24:33',290,'taxi to work',1148338977,'transport');
