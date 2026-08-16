import { MigrationInterface, QueryRunner } from "typeorm";

export class Removerelationbtnuserandpost1786542228934 implements MigrationInterface {
    name = 'Removerelationbtnuserandpost1786542228934'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986"`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "user_id" TO "Author_Id"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "Author_Id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "Author_Id" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "Author_Id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "Author_Id" uuid`);
        await queryRunner.query(`ALTER TABLE "posts" RENAME COLUMN "Author_Id" TO "user_id"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_c4f9a7bd77b489e711277ee5986" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
