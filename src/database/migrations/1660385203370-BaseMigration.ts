import {MigrationInterface, QueryRunner} from "typeorm";

export class BaseMigration1660385203370 implements MigrationInterface {
    name = 'BaseMigration1660385203370'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`studios\` (\`id\` int NOT NULL AUTO_INCREMENT, \`studio_number\` int NOT NULL, \`seat_capacity\` int NOT NULL, \`created_at\` timestamp NOT NULL, \`updated_at\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movies\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`overview\` varchar(255) NOT NULL, \`poster\` varchar(255) NOT NULL, \`play_until\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL, \`updated_at\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movie_schedules\` (\`id\` int NOT NULL AUTO_INCREMENT, \`start_time\` varchar(255) NOT NULL, \`end_time\` varchar(255) NOT NULL, \`price\` int NOT NULL, \`date\` timestamp NOT NULL, \`created_at\` timestamp NOT NULL, \`updated_at\` timestamp NOT NULL, \`movie_id\` int NULL, \`studio_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`users\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`avatar\` varchar(255) NOT NULL, \`is_admin\` tinyint NOT NULL, \`created_at\` timestamp NOT NULL, \`updated_at\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`name\` varchar(255) NOT NULL, \`created_at\` timestamp NOT NULL, \`updated_at\` timestamp NOT NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`movie_tags\` (\`id\` int NOT NULL AUTO_INCREMENT, \`created_at\` timestamp NOT NULL, \`updated_at\` timestamp NOT NULL, \`movie_id\` int NULL, \`tag_id\` int NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`movie_schedules\` ADD CONSTRAINT \`FK_1bc9ff80ec0964c8550025acaf7\` FOREIGN KEY (\`movie_id\`) REFERENCES \`movies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movie_schedules\` ADD CONSTRAINT \`FK_e5631fdeeee0b9cbf449b459e39\` FOREIGN KEY (\`studio_id\`) REFERENCES \`studios\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movie_tags\` ADD CONSTRAINT \`FK_da8c59e083499f43b357ec2ed4c\` FOREIGN KEY (\`movie_id\`) REFERENCES \`movies\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE \`movie_tags\` ADD CONSTRAINT \`FK_f4972e5ac13766ce20ac081cf10\` FOREIGN KEY (\`tag_id\`) REFERENCES \`tags\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`movie_tags\` DROP FOREIGN KEY \`FK_f4972e5ac13766ce20ac081cf10\``);
        await queryRunner.query(`ALTER TABLE \`movie_tags\` DROP FOREIGN KEY \`FK_da8c59e083499f43b357ec2ed4c\``);
        await queryRunner.query(`ALTER TABLE \`movie_schedules\` DROP FOREIGN KEY \`FK_e5631fdeeee0b9cbf449b459e39\``);
        await queryRunner.query(`ALTER TABLE \`movie_schedules\` DROP FOREIGN KEY \`FK_1bc9ff80ec0964c8550025acaf7\``);
        await queryRunner.query(`DROP TABLE \`movie_tags\``);
        await queryRunner.query(`DROP TABLE \`tags\``);
        await queryRunner.query(`DROP TABLE \`users\``);
        await queryRunner.query(`DROP TABLE \`movie_schedules\``);
        await queryRunner.query(`DROP TABLE \`movies\``);
        await queryRunner.query(`DROP TABLE \`studios\``);
    }

}
