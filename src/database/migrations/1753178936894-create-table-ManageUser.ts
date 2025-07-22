import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableManageUser1753178936894 implements MigrationInterface {
  name = 'CreateTableManageUser1753178936894';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`userid\` varchar(36) NOT NULL, \`username\` varchar(255) NOT NULL, \`phone\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`role\` enum ('user', 'admin') NULL DEFAULT 'user', \`avatarUrl\` varchar(255) NULL, \`refreshToken\` varchar(255) NULL, PRIMARY KEY (\`userid\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`tasks\` (\`id\` int NOT NULL AUTO_INCREMENT, \`title\` varchar(255) NOT NULL, \`description\` varchar(255) NULL, \`status\` varchar(255) NULL, \`dueDate\` timestamp NULL, \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), \`fileUrl\` varchar(255) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`refresh_tokens\` (\`id\` varchar(36) NOT NULL, \`token\` varchar(255) NOT NULL, \`expiresAt\` datetime NOT NULL, \`userUserid\` varchar(36) NULL, PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `CREATE TABLE \`audit_logs\` (\`id\` int NOT NULL AUTO_INCREMENT, \`userId\` varchar(255) NULL, \`username\` varchar(255) NULL, \`action\` enum ('LOGIN', 'LOGOUT', 'REGISTER', 'CREATE', 'READ', 'UPDATE', 'DELETE') NOT NULL, \`entityName\` varchar(255) NULL, \`entityId\` varchar(255) NULL, \`ipAddress\` varchar(255) NULL, \`timestamp\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`,
    );
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` ADD CONSTRAINT \`FK_db26726595e6ed93b1aa9e5e4ae\` FOREIGN KEY (\`userUserid\`) REFERENCES \`users\`(\`userid\`) ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE \`refresh_tokens\` DROP FOREIGN KEY \`FK_db26726595e6ed93b1aa9e5e4ae\``,
    );
    await queryRunner.query(`DROP TABLE \`audit_logs\``);
    await queryRunner.query(`DROP TABLE \`refresh_tokens\``);
    await queryRunner.query(`DROP TABLE \`tasks\``);
    await queryRunner.query(`DROP TABLE \`users\``);
  }
}
