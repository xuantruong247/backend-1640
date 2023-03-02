Create database Daba1640;

use Daba1640;

CREATE TABLE `categories` (
    `ID` INTEGER NOT NULL,
    `_id` VARBINARY(12),
    `name` LONGTEXT,
    `description` LONGTEXT,
    `createAt` DATETIME,
    `__v` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;

CREATE TABLE `comments` (
    `ID` INTEGER NOT NULL,
    `_id` VARBINARY(12),
    `content` LONGTEXT,
    `userId` VARBINARY(12),
    `isAnonymously` BIT,
    `createdAt` DATETIME,
    `updatedAt` DATETIME,
    `__v` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `departments` (
    `ID` INTEGER NOT NULL,
    `_id` VARBINARY(12),
    `name` LONGTEXT,
    `description` LONGTEXT,
    `createAt` DATETIME,
    `__v` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;

CREATE TABLE `ideas` (
    `ID` INTEGER NOT NULL,
    `_id` VARBINARY(12),
    `title` LONGTEXT,
    `categoryId` VARBINARY(12),
    `description` LONGTEXT,
    `content` LONGTEXT,
    `userId` VARBINARY(12),
    `submissionId` VARBINARY(12),
    `isActive` BIT,
    `isAnonymously` BIT,
    `createdAt` DATETIME,
    `updatedAt` DATETIME,
    `__v` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `ideas_files` (
    `ID` INTEGER NOT NULL,
    `parent_fk` INTEGER,
    `INDEX` INTEGER,
    `Object_fk` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `ideas_files_Object` (
    `ID` INTEGER NOT NULL,
    `fileName` LONGTEXT,
    `filePath` LONGTEXT,
    `_id` VARBINARY(12),
    `createdAt` DATETIME,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `ideas_comments` (
    `ID` INTEGER NOT NULL,
    `parent_fk` INTEGER,
    `INDEX` INTEGER,
    `Object_fk` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `ideas_comments_Object` (
    `ID` INTEGER NOT NULL,
    `commentId` VARBINARY(12),
    `_id` VARBINARY(12),
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `ideas_reactions` (
    `ID` INTEGER NOT NULL,
    `parent_fk` INTEGER,
    `INDEX` INTEGER,
    `Object_fk` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `ideas_reactions_Object` (
    `ID` INTEGER NOT NULL,
    `reactionId` VARBINARY(12),
    `_id` VARBINARY(12),
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `ideas_views` (
    `ID` INTEGER NOT NULL,
    `parent_fk` INTEGER,
    `INDEX` INTEGER,
    `Object_fk` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `ideas_views_Object` (
    `ID` INTEGER NOT NULL,
    `viewId` VARBINARY(12),
    `_id` VARBINARY(12),
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


ALTER TABLE `ideas_files`
ADD CONSTRAINT `s3t_ideas_files_ideas_0` FOREIGN KEY (`parent_fk`) REFERENCES `ideas`(`ID`),
ADD CONSTRAINT `s3t_ideas_files_ideas_files_Object_0` FOREIGN KEY (`Object_fk`) REFERENCES `ideas_files_Object`(`ID`);


ALTER TABLE `ideas_comments`
ADD CONSTRAINT `s3t_ideas_comments_ideas_0` FOREIGN KEY (`parent_fk`) REFERENCES `ideas`(`ID`),
ADD CONSTRAINT `s3t_ideas_comments_ideas_comments_Object_0` FOREIGN KEY (`Object_fk`) REFERENCES `ideas_comments_Object`(`ID`);


ALTER TABLE `ideas_reactions`
ADD CONSTRAINT `s3t_ideas_reactions_ideas_0` FOREIGN KEY (`parent_fk`) REFERENCES `ideas`(`ID`),
ADD CONSTRAINT `s3t_ideas_reactions_ideas_reactions_Object_0` FOREIGN KEY (`Object_fk`) REFERENCES `ideas_reactions_Object`(`ID`);


ALTER TABLE `ideas_views`
ADD CONSTRAINT `s3t_ideas_views_ideas_0` FOREIGN KEY (`parent_fk`) REFERENCES `ideas`(`ID`),
ADD CONSTRAINT `s3t_ideas_views_ideas_views_Object_0` FOREIGN KEY (`Object_fk`) REFERENCES `ideas_views_Object`(`ID`);

CREATE TABLE `roles` (
    `ID` INTEGER NOT NULL,
    `_id` VARBINARY(12),
    `name` LONGTEXT,
    `description` LONGTEXT,
    `createAt` DATETIME,
    `__v` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;

CREATE TABLE `submissions` (
    `ID` INTEGER NOT NULL,
    `_id` VARBINARY(12),
    `name` LONGTEXT,
    `description` LONGTEXT,
    `closureDate` DATETIME,
    `finalClosureDate` DATETIME,
    `createdAt` DATETIME,
    `__v` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;

CREATE TABLE `views` (
    `ID` INTEGER NOT NULL,
    `_id` VARBINARY(12),
    `isVisited` BIT,
    `userId` VARBINARY(12),
    `createdAt` DATETIME,
    `updatedAt` DATETIME,
    `__v` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;

CREATE TABLE `users` (
    `ID` INTEGER NOT NULL,
    `_id` VARBINARY(12),
    `username` LONGTEXT,
    `password` LONGTEXT,
    `fullName` LONGTEXT,
    `department_fk` INTEGER,
    `anonymously_fk` INTEGER,
    `contact_fk` INTEGER,
    `createAt` DATETIME,
    `__v` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_roles` (
    `ID` INTEGER NOT NULL,
    `parent_fk` INTEGER,
    `INDEX` INTEGER,
    `Object_fk` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_roles_Object` (
    `ID` INTEGER NOT NULL,
    `roleId` VARBINARY(12),
    `_id` VARBINARY(12),
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_department` (
    `ID` INTEGER NOT NULL,
    `departmentId` VARBINARY(12),
    `isQACoordinator` BIT,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_anonymously` (
    `ID` INTEGER NOT NULL,
    `idea` BIT,
    `comment` BIT,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_contact` (
    `ID` INTEGER NOT NULL,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_contact_emails` (
    `ID` INTEGER NOT NULL,
    `parent_fk` INTEGER,
    `INDEX` INTEGER,
    `Object_fk` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_contact_emails_Object` (
    `ID` INTEGER NOT NULL,
    `email` LONGTEXT,
    `_id` VARBINARY(12),
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_contact_phones` (
    `ID` INTEGER NOT NULL,
    `parent_fk` INTEGER,
    `INDEX` INTEGER,
    `Object_fk` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_contact_phones_Object` (
    `ID` INTEGER NOT NULL,
    `phone` LONGTEXT,
    `_id` VARBINARY(12),
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_contact_addresses` (
    `ID` INTEGER NOT NULL,
    `parent_fk` INTEGER,
    `INDEX` INTEGER,
    `Object_fk` INTEGER,
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


CREATE TABLE `users_contact_addresses_Object` (
    `ID` INTEGER NOT NULL,
    `street` LONGTEXT,
    `city` LONGTEXT,
    `country` LONGTEXT,
    `_id` VARBINARY(12),
    PRIMARY KEY (`ID`)
) CHARSET=utf8mb4;


ALTER TABLE `users`
ADD CONSTRAINT `s3t_users_users_anonymously_0` FOREIGN KEY (`anonymously_fk`) REFERENCES `users_anonymously`(`ID`),
ADD CONSTRAINT `s3t_users_users_contact_0` FOREIGN KEY (`contact_fk`) REFERENCES `users_contact`(`ID`),
ADD CONSTRAINT `s3t_users_users_department_0` FOREIGN KEY (`department_fk`) REFERENCES `users_department`(`ID`);


ALTER TABLE `users_roles`
ADD CONSTRAINT `s3t_users_roles_users_0` FOREIGN KEY (`parent_fk`) REFERENCES `users`(`ID`),
ADD CONSTRAINT `s3t_users_roles_users_roles_Object_0` FOREIGN KEY (`Object_fk`) REFERENCES `users_roles_Object`(`ID`);


ALTER TABLE `users_contact_emails`
ADD CONSTRAINT `s3t_users_contact_emails_users_contact_0` FOREIGN KEY (`parent_fk`) REFERENCES `users_contact`(`ID`),
ADD CONSTRAINT `s3t_users_contact_emails_users_contact_emails_Obje_0` FOREIGN KEY (`Object_fk`) REFERENCES `users_contact_emails_Object`(`ID`);


ALTER TABLE `users_contact_phones`
ADD CONSTRAINT `s3t_users_contact_phones_users_contact_0` FOREIGN KEY (`parent_fk`) REFERENCES `users_contact`(`ID`),
ADD CONSTRAINT `s3t_users_contact_phones_users_contact_phones_Obje_0` FOREIGN KEY (`Object_fk`) REFERENCES `users_contact_phones_Object`(`ID`);


ALTER TABLE `users_contact_addresses`
ADD CONSTRAINT `s3t_users_contact_addresses_users_contact_0` FOREIGN KEY (`parent_fk`) REFERENCES `users_contact`(`ID`),
ADD CONSTRAINT `s3t_users_contact_addresses_users_contact_addresses_O_0` FOREIGN KEY (`Object_fk`) REFERENCES `users_contact_addresses_Object`(`ID`);



