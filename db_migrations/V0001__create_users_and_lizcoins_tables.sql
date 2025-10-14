-- Создание таблицы пользователей с аккаунтами и лизкоинами
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255),
    password_hash VARCHAR(255) NOT NULL,
    lizcoins INTEGER DEFAULT 50 NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    last_visit TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT positive_lizcoins CHECK (lizcoins >= 0)
);

-- Создание индексов для быстрого поиска
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_lizcoins ON users(lizcoins DESC);

-- Создание таблицы истории транзакций лизкоинов
CREATE TABLE IF NOT EXISTS lizcoins_transactions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    amount INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    balance_after INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Индекс для быстрого получения истории пользователя
CREATE INDEX idx_transactions_user_id ON lizcoins_transactions(user_id);
CREATE INDEX idx_transactions_created_at ON lizcoins_transactions(created_at DESC);

-- Создание таблицы купленных подарков
CREATE TABLE IF NOT EXISTS purchased_gifts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    gift_id VARCHAR(100) NOT NULL,
    gift_name VARCHAR(255) NOT NULL,
    price INTEGER NOT NULL,
    purchased_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Индекс для быстрого получения подарков пользователя
CREATE INDEX idx_purchased_gifts_user_id ON purchased_gifts(user_id);
CREATE INDEX idx_purchased_gifts_purchased_at ON purchased_gifts(purchased_at DESC);

-- Создание таблицы посещений разделов
CREATE TABLE IF NOT EXISTS section_visits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    section_id VARCHAR(50) NOT NULL,
    last_visit_date DATE NOT NULL,
    UNIQUE(user_id, section_id)
);

-- Индекс для быстрой проверки посещений
CREATE INDEX idx_section_visits_user_section ON section_visits(user_id, section_id);