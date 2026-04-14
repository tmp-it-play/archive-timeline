CREATE TABLE IF NOT EXISTS `tbl_teacher` (
  `id`           BIGINT       NOT NULL AUTO_INCREMENT,
  `user_id`      BIGINT       NOT NULL,
  `school_id`    BIGINT       NOT NULL,
  `device_token` VARCHAR(255) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_teacher_user_id` (`user_id`),
  CONSTRAINT `fk_teacher_user`   FOREIGN KEY (`user_id`)   REFERENCES `tbl_user`   (`id`),
  CONSTRAINT `fk_teacher_school` FOREIGN KEY (`school_id`) REFERENCES `tbl_school` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
