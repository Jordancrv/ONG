import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialHardeningWeek121700000001001 implements MigrationInterface {
  name = 'InitialHardeningWeek121700000001001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1) Data cleanup before tightening constraints.
    await queryRunner.query(`
      UPDATE courses
      SET slug = CONCAT('course-', id)
      WHERE slug IS NULL OR slug = ''
    `);

    await queryRunner.query(`
      UPDATE courses c
      JOIN (
        SELECT slug
        FROM courses
        GROUP BY slug
        HAVING COUNT(*) > 1
      ) d ON d.slug = c.slug
      SET c.slug = CONCAT(c.slug, '-', c.id)
    `);

    await queryRunner.query(`
      UPDATE courses
      SET owner_id = (SELECT id FROM users ORDER BY id LIMIT 1)
      WHERE owner_id IS NULL
    `);

    await queryRunner.query(`DELETE FROM subscriptions WHERE user_id IS NULL OR plan_id IS NULL`);
    await queryRunner.query(`DELETE FROM course_modules WHERE course_id IS NULL`);
    await queryRunner.query(`DELETE FROM lessons WHERE module_id IS NULL`);
    await queryRunner.query(`DELETE FROM enrollments WHERE user_id IS NULL OR course_id IS NULL`);
    await queryRunner.query(`DELETE FROM lesson_progress WHERE user_id IS NULL OR lesson_id IS NULL`);
    await queryRunner.query(`DELETE FROM attempts WHERE quiz_id IS NULL OR user_id IS NULL`);
    await queryRunner.query(`DELETE FROM answers WHERE attempt_id IS NULL OR question_id IS NULL`);
    await queryRunner.query(`DELETE FROM questions WHERE quiz_id IS NULL`);
    await queryRunner.query(`DELETE FROM options WHERE question_id IS NULL`);
    await queryRunner.query(`DELETE FROM user_points WHERE user_id IS NULL OR course_id IS NULL`);

    // 2) Consolidate duplicates before UNIQUE constraints.
    await queryRunner.query(`
      CREATE TEMPORARY TABLE tmp_enrollments_keep AS
      SELECT MIN(id) AS keep_id, user_id, course_id
      FROM enrollments
      GROUP BY user_id, course_id
    `);

    await queryRunner.query(`
      DELETE e
      FROM enrollments e
      JOIN tmp_enrollments_keep k
        ON e.user_id = k.user_id
       AND e.course_id = k.course_id
      WHERE e.id <> k.keep_id
    `);

    await queryRunner.query(`DROP TEMPORARY TABLE tmp_enrollments_keep`);

    await queryRunner.query(`
      CREATE TEMPORARY TABLE tmp_progress_keep AS
      SELECT MIN(id) AS keep_id, user_id, lesson_id
      FROM lesson_progress
      GROUP BY user_id, lesson_id
    `);

    await queryRunner.query(`
      DELETE lp
      FROM lesson_progress lp
      JOIN tmp_progress_keep k
        ON lp.user_id = k.user_id
       AND lp.lesson_id = k.lesson_id
      WHERE lp.id <> k.keep_id
    `);

    await queryRunner.query(`DROP TEMPORARY TABLE tmp_progress_keep`);

    await queryRunner.query(`
      CREATE TEMPORARY TABLE tmp_user_points_agg AS
      SELECT MIN(id) AS keep_id, user_id, course_id, SUM(points) AS total_points
      FROM user_points
      GROUP BY user_id, course_id
    `);

    await queryRunner.query(`
      UPDATE user_points up
      JOIN tmp_user_points_agg agg ON up.id = agg.keep_id
      SET up.points = agg.total_points
    `);

    await queryRunner.query(`
      DELETE up
      FROM user_points up
      JOIN tmp_user_points_agg agg
        ON up.user_id = agg.user_id
       AND up.course_id = agg.course_id
      WHERE up.id <> agg.keep_id
    `);

    await queryRunner.query(`DROP TEMPORARY TABLE tmp_user_points_agg`);

    // Normalize ordering to avoid conflicts in composite unique constraints.
    await queryRunner.query(`
      CREATE TEMPORARY TABLE tmp_module_positions AS
      SELECT id,
             ROW_NUMBER() OVER (PARTITION BY course_id ORDER BY \`index\`, id) AS new_position
      FROM course_modules
    `);

    await queryRunner.query(`
      UPDATE course_modules cm
      JOIN tmp_module_positions p ON cm.id = p.id
      SET cm.\`index\` = p.new_position
    `);

    await queryRunner.query(`DROP TEMPORARY TABLE tmp_module_positions`);

    await queryRunner.query(`
      CREATE TEMPORARY TABLE tmp_lesson_positions AS
      SELECT id,
             ROW_NUMBER() OVER (PARTITION BY module_id ORDER BY \`index\`, id) AS new_position
      FROM lessons
    `);

    await queryRunner.query(`
      UPDATE lessons l
      JOIN tmp_lesson_positions p ON l.id = p.id
      SET l.\`index\` = p.new_position
    `);

    await queryRunner.query(`DROP TEMPORARY TABLE tmp_lesson_positions`);

    // 3) Drop FK constraints, alter nullability, then re-add FKs.
    await queryRunner.query(`ALTER TABLE subscriptions DROP FOREIGN KEY FK_d0a95ef8a28188364c546eb65c1`);
    await queryRunner.query(`ALTER TABLE subscriptions DROP FOREIGN KEY FK_e45fca5d912c3a2fab512ac25dc`);
    await queryRunner.query(`ALTER TABLE subscriptions MODIFY user_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE subscriptions MODIFY plan_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE subscriptions ADD CONSTRAINT FK_d0a95ef8a28188364c546eb65c1 FOREIGN KEY (user_id) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE subscriptions ADD CONSTRAINT FK_e45fca5d912c3a2fab512ac25dc FOREIGN KEY (plan_id) REFERENCES membership_plans(id)`);

    await queryRunner.query(`ALTER TABLE courses DROP FOREIGN KEY FK_8e2bcdb457d982b1dc39e5e0edb`);
    await queryRunner.query(`ALTER TABLE courses MODIFY owner_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE courses MODIFY slug varchar(255) NOT NULL`);
    await queryRunner.query(`ALTER TABLE courses ADD CONSTRAINT FK_8e2bcdb457d982b1dc39e5e0edb FOREIGN KEY (owner_id) REFERENCES users(id)`);

    await queryRunner.query(`ALTER TABLE course_modules DROP FOREIGN KEY FK_81644557c2401f37fe9e884e884`);
    await queryRunner.query(`ALTER TABLE course_modules MODIFY course_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE course_modules ADD CONSTRAINT FK_81644557c2401f37fe9e884e884 FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE lessons DROP FOREIGN KEY FK_35fb2307535d90a6ed290af1f4a`);
    await queryRunner.query(`ALTER TABLE lessons MODIFY module_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE lessons ADD CONSTRAINT FK_35fb2307535d90a6ed290af1f4a FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE enrollments DROP FOREIGN KEY FK_ff997f5a39cd24a491b9aca45c9`);
    await queryRunner.query(`ALTER TABLE enrollments DROP FOREIGN KEY FK_b79d0bf01779fdf9cfb6b092af3`);
    await queryRunner.query(`ALTER TABLE enrollments MODIFY user_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE enrollments MODIFY course_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE enrollments ADD CONSTRAINT FK_ff997f5a39cd24a491b9aca45c9 FOREIGN KEY (user_id) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE enrollments ADD CONSTRAINT FK_b79d0bf01779fdf9cfb6b092af3 FOREIGN KEY (course_id) REFERENCES courses(id)`);

    await queryRunner.query(`ALTER TABLE lesson_progress DROP FOREIGN KEY FK_0d9292b3eb40707950eeeba9617`);
    await queryRunner.query(`ALTER TABLE lesson_progress DROP FOREIGN KEY FK_980e74721039ebe210fee2eeca2`);
    await queryRunner.query(`ALTER TABLE lesson_progress MODIFY user_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE lesson_progress MODIFY lesson_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE lesson_progress ADD CONSTRAINT FK_0d9292b3eb40707950eeeba9617 FOREIGN KEY (user_id) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE lesson_progress ADD CONSTRAINT FK_980e74721039ebe210fee2eeca2 FOREIGN KEY (lesson_id) REFERENCES lessons(id)`);

    await queryRunner.query(`ALTER TABLE attempts DROP FOREIGN KEY FK_1f23e642cf6e009c61cc2c214e2`);
    await queryRunner.query(`ALTER TABLE attempts DROP FOREIGN KEY FK_249da279880fff0c23541e52515`);
    await queryRunner.query(`ALTER TABLE attempts MODIFY quiz_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE attempts MODIFY user_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE attempts ADD CONSTRAINT FK_1f23e642cf6e009c61cc2c214e2 FOREIGN KEY (user_id) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE attempts ADD CONSTRAINT FK_249da279880fff0c23541e52515 FOREIGN KEY (quiz_id) REFERENCES quizzes(id)`);

    await queryRunner.query(`ALTER TABLE answers DROP FOREIGN KEY FK_e600c136cef60f166f0b315ab19`);
    await queryRunner.query(`ALTER TABLE answers DROP FOREIGN KEY FK_677120094cf6d3f12df0b9dc5d3`);
    await queryRunner.query(`ALTER TABLE answers MODIFY attempt_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE answers MODIFY question_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE answers ADD CONSTRAINT FK_e600c136cef60f166f0b315ab19 FOREIGN KEY (attempt_id) REFERENCES attempts(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE answers ADD CONSTRAINT FK_677120094cf6d3f12df0b9dc5d3 FOREIGN KEY (question_id) REFERENCES questions(id)`);

    await queryRunner.query(`ALTER TABLE questions DROP FOREIGN KEY FK_46b3c125e02f7242662e4ccb307`);
    await queryRunner.query(`ALTER TABLE questions MODIFY quiz_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE questions ADD CONSTRAINT FK_46b3c125e02f7242662e4ccb307 FOREIGN KEY (quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE options DROP FOREIGN KEY FK_2bdd03245b8cb040130fe16f21d`);
    await queryRunner.query(`ALTER TABLE options MODIFY question_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE options ADD CONSTRAINT FK_2bdd03245b8cb040130fe16f21d FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE`);

    await queryRunner.query(`ALTER TABLE user_points DROP FOREIGN KEY FK_b63a87a96091c755b78a75eecbc`);
    await queryRunner.query(`ALTER TABLE user_points DROP FOREIGN KEY FK_44f02f2ff7d0ae4bd9be9cd24cf`);
    await queryRunner.query(`ALTER TABLE user_points MODIFY user_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE user_points MODIFY course_id int NOT NULL`);
    await queryRunner.query(`ALTER TABLE user_points ADD CONSTRAINT FK_b63a87a96091c755b78a75eecbc FOREIGN KEY (user_id) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE user_points ADD CONSTRAINT FK_44f02f2ff7d0ae4bd9be9cd24cf FOREIGN KEY (course_id) REFERENCES courses(id)`);

    // 4) Add unique constraints from Week 1-2 plan.
    await queryRunner.query(`ALTER TABLE courses ADD UNIQUE INDEX UQ_courses_slug (slug)`);
    await queryRunner.query(`ALTER TABLE enrollments ADD UNIQUE INDEX UQ_enrollments_user_course (user_id, course_id)`);
    await queryRunner.query(`ALTER TABLE lesson_progress ADD UNIQUE INDEX UQ_lesson_progress_user_lesson (user_id, lesson_id)`);
    await queryRunner.query(`ALTER TABLE user_points ADD UNIQUE INDEX UQ_user_points_user_course (user_id, course_id)`);
    await queryRunner.query('ALTER TABLE course_modules ADD UNIQUE INDEX UQ_course_modules_course_index (course_id, `index`)');
    await queryRunner.query('ALTER TABLE lessons ADD UNIQUE INDEX UQ_lessons_module_index (module_id, `index`)');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop FKs that can depend on composite indexes to avoid ER_DROP_INDEX_FK on MySQL.
    await queryRunner.query(`ALTER TABLE lessons DROP FOREIGN KEY FK_35fb2307535d90a6ed290af1f4a`);
    await queryRunner.query(`ALTER TABLE course_modules DROP FOREIGN KEY FK_81644557c2401f37fe9e884e884`);
    await queryRunner.query(`ALTER TABLE enrollments DROP FOREIGN KEY FK_ff997f5a39cd24a491b9aca45c9`);
    await queryRunner.query(`ALTER TABLE enrollments DROP FOREIGN KEY FK_b79d0bf01779fdf9cfb6b092af3`);
    await queryRunner.query(`ALTER TABLE lesson_progress DROP FOREIGN KEY FK_0d9292b3eb40707950eeeba9617`);
    await queryRunner.query(`ALTER TABLE lesson_progress DROP FOREIGN KEY FK_980e74721039ebe210fee2eeca2`);
    await queryRunner.query(`ALTER TABLE user_points DROP FOREIGN KEY FK_b63a87a96091c755b78a75eecbc`);
    await queryRunner.query(`ALTER TABLE user_points DROP FOREIGN KEY FK_44f02f2ff7d0ae4bd9be9cd24cf`);

    // Revert unique constraints.
    await queryRunner.query(`ALTER TABLE lessons DROP INDEX UQ_lessons_module_index`);
    await queryRunner.query(`ALTER TABLE course_modules DROP INDEX UQ_course_modules_course_index`);
    await queryRunner.query(`ALTER TABLE user_points DROP INDEX UQ_user_points_user_course`);
    await queryRunner.query(`ALTER TABLE lesson_progress DROP INDEX UQ_lesson_progress_user_lesson`);
    await queryRunner.query(`ALTER TABLE enrollments DROP INDEX UQ_enrollments_user_course`);
    await queryRunner.query(`ALTER TABLE courses DROP INDEX UQ_courses_slug`);

    // Revert NOT NULL changes.
    await queryRunner.query(`ALTER TABLE subscriptions MODIFY user_id int NULL`);
    await queryRunner.query(`ALTER TABLE subscriptions MODIFY plan_id int NULL`);

    await queryRunner.query(`ALTER TABLE courses MODIFY owner_id int NULL`);
    await queryRunner.query(`ALTER TABLE courses MODIFY slug varchar(255) NULL`);

    await queryRunner.query(`ALTER TABLE course_modules MODIFY course_id int NULL`);
    await queryRunner.query(`ALTER TABLE lessons MODIFY module_id int NULL`);

    await queryRunner.query(`ALTER TABLE enrollments MODIFY user_id int NULL`);
    await queryRunner.query(`ALTER TABLE enrollments MODIFY course_id int NULL`);

    await queryRunner.query(`ALTER TABLE lesson_progress MODIFY user_id int NULL`);
    await queryRunner.query(`ALTER TABLE lesson_progress MODIFY lesson_id int NULL`);

    await queryRunner.query(`ALTER TABLE attempts MODIFY quiz_id int NULL`);
    await queryRunner.query(`ALTER TABLE attempts MODIFY user_id int NULL`);

    await queryRunner.query(`ALTER TABLE answers MODIFY attempt_id int NULL`);
    await queryRunner.query(`ALTER TABLE answers MODIFY question_id int NULL`);

    await queryRunner.query(`ALTER TABLE questions MODIFY quiz_id int NULL`);
    await queryRunner.query(`ALTER TABLE options MODIFY question_id int NULL`);

    await queryRunner.query(`ALTER TABLE user_points MODIFY user_id int NULL`);
    await queryRunner.query(`ALTER TABLE user_points MODIFY course_id int NULL`);

    // Restore dropped FKs (same behavior as schema before this down completes).
    await queryRunner.query(`ALTER TABLE course_modules ADD CONSTRAINT FK_81644557c2401f37fe9e884e884 FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE lessons ADD CONSTRAINT FK_35fb2307535d90a6ed290af1f4a FOREIGN KEY (module_id) REFERENCES course_modules(id) ON DELETE CASCADE`);
    await queryRunner.query(`ALTER TABLE enrollments ADD CONSTRAINT FK_ff997f5a39cd24a491b9aca45c9 FOREIGN KEY (user_id) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE enrollments ADD CONSTRAINT FK_b79d0bf01779fdf9cfb6b092af3 FOREIGN KEY (course_id) REFERENCES courses(id)`);
    await queryRunner.query(`ALTER TABLE lesson_progress ADD CONSTRAINT FK_0d9292b3eb40707950eeeba9617 FOREIGN KEY (user_id) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE lesson_progress ADD CONSTRAINT FK_980e74721039ebe210fee2eeca2 FOREIGN KEY (lesson_id) REFERENCES lessons(id)`);
    await queryRunner.query(`ALTER TABLE user_points ADD CONSTRAINT FK_b63a87a96091c755b78a75eecbc FOREIGN KEY (user_id) REFERENCES users(id)`);
    await queryRunner.query(`ALTER TABLE user_points ADD CONSTRAINT FK_44f02f2ff7d0ae4bd9be9cd24cf FOREIGN KEY (course_id) REFERENCES courses(id)`);
  }
}
