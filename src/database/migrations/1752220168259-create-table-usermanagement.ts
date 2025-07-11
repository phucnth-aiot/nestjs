import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateTableUsermanagement1752220168259 implements MigrationInterface {
    name = 'CreateTableUsermanagement1752220168259'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`refresh_tokens\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`userUserid\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_db26726595e6ed93b1aa9e5e4ae\` FOREIGN KEY (\`userUserid\`) REFERENCES \`users\`(\`userid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_db26726595e6ed93b1aa9e5e4ae\``);
        await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
    }

}
