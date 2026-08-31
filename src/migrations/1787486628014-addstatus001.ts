import { MigrationInterface, QueryRunner } from "typeorm";

export class Addstatus0011787486628014 implements MigrationInterface {
    name = 'Addstatus0011787486628014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."gallery_status_g_enum" AS ENUM('DRAFT', 'PUBLISHED', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD "status_g" "public"."gallery_status_g_enum" NOT NULL DEFAULT 'DRAFT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "status_g"`);
        await queryRunner.query(`DROP TYPE "public"."gallery_status_g_enum"`);
    }

}
