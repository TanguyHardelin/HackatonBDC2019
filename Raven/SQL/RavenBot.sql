/*
    EXPLICATION DATABASE:

    action_type= PSEUDO
    action_param_0 -> nom de la personne
    action_param_1 -> nouveau pseudo

    action_type= TEXT_REACTION
    action_param_0 -> nom de la personne
    action_param_1 -> message a reagir
    action_param_2 -> message a repondre
*/
USE raven;

CREATE TABLE RavenAction(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    action_type VARCHAR(20),
    action_param_0 VARCHAR(255),
    action_param_1 VARCHAR(255),
    action_param_2 VARCHAR(1000)
);