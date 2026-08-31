import { MigrationInterface, QueryRunner } from "typeorm";

export class Addststusongallery1787484369739 implements MigrationInterface {
    name = 'Addststusongallery1787484369739'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."gallery_status_gallery_enum" AS ENUM('DRAFT', 'PUBLISHED', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD "status_gallery" "public"."gallery_status_gallery_enum" NOT NULL DEFAULT 'DRAFT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "status_gallery"`);
        await queryRunner.query(`DROP TYPE "public"."gallery_status_gallery_enum"`);
    }

}
