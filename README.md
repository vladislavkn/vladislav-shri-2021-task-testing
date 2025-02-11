# Домашнее задание по теме "Интеграционные тесты"

- [Текст задания](./TASK.md)
- [Описание тестов](./TESTS.md)

## Описание решения

В ходе решения было создано 2 плагина для hermione - плагин **hermione-auto-start-selenium** и **hermione-auto-start-project**.

hermione-auto-start-selenium позволяет автоматически запускать selenium-сервер (если он ещё не запущен) перед запуском тестов.
Вот его параметры и дефолтные значения:

```js
{
  "pollInterval": 500, // Интервал пинга сервера
  "maxTime": 5000 // Максимальное время ожидания запуска сервера
}
```

hermione-auto-start-project собирает приложение (если ещё не собрано) и запускает его (если ещё не запущено) перед запуском тестов.
Вот его параметры и дефолтные значения:

```js
{
  "startCommand": "npm run start", // Команда старта приложения
  "buildCommand": "npm run build", // Команда сборки приложения
  "buildFolder": path.join(".", "dist"), // Папка собранного приложения (используется для проверки)
  "port": PORT, // Порт, на котором будет запущено приложение
  "path": "/hw/store", // Путь к индексному роуту приложения (используется для проверки)
  "maxTime": 20000, // Максимальное время ожидания запуска сервера
  "pollInterval": 500, // Интервал пинга сервера
}
```

Все плагины лежат в ./packages. Там же лежит модуль-утилита ping-server. Подключить плагины можно через npm-link.
В корне лежит скрипт setup.bash, который автоматически установит зависимости и подключит пакеты. Очень надеюсь, что он заработает на вашей машине. У меня очень мало опыта с bash и процессами в nodejs, так что если что-то пойдет не так, пожалуйста, пишите мне в тг: @Soup_master.

С уважением,
Кнышов Владислав
