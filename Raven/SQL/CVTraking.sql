USE raven;

CREATE TABLE CV_IP_List(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ip VARCHAR(15) UNIQUE,
    seen BOOLEAN
);

CREATE TABLE CV_IP_Actions(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    ip_id INT UNSIGNED NOT NULL,
    action_type TEXT,
    action_date VARCHAR(19),
    action_value TEXT,
    CONSTRAINT ip_id          -- On donne un nom à notre clé
        FOREIGN KEY (ip_id)             -- Colonne sur laquelle on crée la clé
        REFERENCES CV_IP_List(id)        -- Colonne de référence
);