import { MigrationInterface, QueryRunner } from "typeorm";

export class Addstatus0011787486691559 implements MigrationInterface {
    name = 'Addstatus0011787486691559'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" ADD "status_g" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "status_g"`);
    }

}
