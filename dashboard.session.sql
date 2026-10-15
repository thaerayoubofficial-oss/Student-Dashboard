-- @block
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL
);

-- @block
CREATE TABLE IF NOT EXISTS administrators (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    special_key VARCHAR(255) NOT NULL UNIQUE
);

-- @block
CREATE TABLE IF NOT EXISTS classes (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    class_name VARCHAR(100) NOT NULL,
    duration INT NOT NULL,
    from_time TIME NOT NULL,
    to_time TIME NOT NULL,
    frequency ENUM('daily', 'weekly', 'monthly') NOT NULL,

    FOREIGN KEY (user_id) REFERENCES users(id)
        ON DELETE CASCADE
);

-- @block
CREATE TABLE IF NOT EXISTS homeworks (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    class_id INT UNSIGNED NOT NULL,
    homework_name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,

    FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE
);

-- @block
CREATE TABLE IF NOT EXISTS assignments (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    class_id INT UNSIGNED NOT NULL,
    assignment_name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,

    FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE
);

-- @block
CREATE TABLE IF NOT EXISTS projects (
    id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    class_id INT UNSIGNED NOT NULL,
    project_name VARCHAR(100) NOT NULL,
    description TEXT,
    due_date DATETIME NOT NULL,
    completed BOOLEAN NOT NULL DEFAULT FALSE,

    FOREIGN KEY (class_id) REFERENCES classes(id)
        ON DELETE CASCADE
);