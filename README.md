![Express Logo](https://st.timeweb.com/cloud-static/apps-logo/express.svg)

# Express

#### Приложение [Express](https://expressjs.com/)

## <a name="dev"></a>Локальный запуск проекта

```bash
# установка зависимостей
npm install

# запуск приложения
npm run start
```

## Методы
#### МЕТОД 1. При переходе на страницу **"/api/calc/income/"** подсчет количества доходов направления 
#### Пример тела запроса: 
```json
{
    "data": [
        {
            "cash": [144718, 144718, 144718, 144718],
            "students": [0, 0, 14, 21]
        },
        {
            "cash": [136200, 136200, 135900, 141600],
            "students": [18, 65, 41, 12]
        }
    ]
}
```

#### Пример ответа: 
```json
{
    "budget": 5065130,
    "commerce": 18575700,
    "sum": 23640830
}
```