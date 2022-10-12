// Вначале подключены все сторонние пакеты, которые нужны для функционирования приложения.
const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");

// После мы подключаем роуты, в дальнейшем мы их изменим и внесем дополнительный функционал.
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");

// Создается экземпляр приложения и подключаем шаблоны
const app = express();

// После идет блок подключения промежуточного ПО (view engine setup).
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// Подключается логгер, обработка JSON и данных из форм, и в конце модуль для работы с cookie.
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// После идет подключение роутеров в приложение.
app.use("/", indexRouter);
app.use("/users", usersRouter);

// Помните, что порядок подключаемого промежуточного ПО имеет значение.
// Вначале происходит обработка несуществующего роута или ошибка 404 (catch 404 and forward to error handler).
app.use(function (req, res, next) {
  next(createError(404)); // По сути отсутствие обработчика на запрашиваемый у сервера роутер это не ошибка и мы создаем ошибку и пробрасываем ее дальше для обработки.
});

// В конце приложения идет обработка ошибок (error handler).
// Здесь и происходит обработка ошибки. Мы пробрасываем переменные message и error в шаблон error.ejs и выполняем его рендер/
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
