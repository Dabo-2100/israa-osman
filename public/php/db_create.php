<?php
$statements = [
    'CREATE TABLE IF NOT EXISTS app_users( 
        user_id             INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        user_email          VARCHAR(255) NOT NULL,
        user_password       VARCHAR(255) NOT NULL, 
        user_name           VARCHAR(255) Not NULL,
        user_country        VARCHAR(255) NULL,
        user_age            INT(20) NULL,
        user_phone          VARCHAR(255) NULL,
        user_gender         VARCHAR(255) NULL,
        verification_code   INT(20) NOT NULL,
        is_verified         INT(20) NOT NULL,
        user_uid            VARCHAR(255) NOT NUll,
        created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        last_update         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )',

    'CREATE TABLE IF NOT EXISTS appointments( 
        appoint_id          INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        appoint_index       INT(20) NOT NULL,
        user_id             INT(20) Not NULL,
        appoint_day         DATE NOT NULL,
        appoint_type        INT(20) NOT NULL,
        appoint_time_index  INT(20) NOT NULL, 
        order_id            INT(20)NULL,
        created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
        last_update         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )',

    'CREATE TABLE IF NOT EXISTS chats( 
    chat_id            INT(20) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_1             INT(20) NOT NULL,
    user_2             INT(20) Not NULL,
    user_1_view        INT(20) NOT NULL,
    user_2_view        INT(20) NOT NULL,
    created_at          TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
    last_update         TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )',

];

// connect to the database
$pdo = require 'connect.php';

// execute SQL statements
foreach ($statements as $statement) {
    $pdo->exec($statement);
}
