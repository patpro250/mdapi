import { MigrationInterface, QueryRunner } from "typeorm";

export class Addststusongallery1787484270338 implements MigrationInterface {
    name = 'Addststusongallery1787484270338'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."gallery_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD "status" "public"."gallery_status_enum" NOT NULL DEFAULT 'DRAFT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "status"`);
        await queryRunner.query(`DROP TYPE "public"."gallery_status_enum"`);
    }

}
