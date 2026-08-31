import { MigrationInterface, QueryRunner } from "typeorm";

export class Addstandard1787484421092 implements MigrationInterface {
    name = 'Addstandard1787484421092'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."gallery_status_gallery_enum" AS ENUM('DRAFT', 'PUBLISHED', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "gallery" ADD "status_gallery" "public"."gallery_status_gallery_enum" NOT NULL DEFAULT 'DRAFT'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "gallery" DROP COLUMN "status_gallery"`);
        await queryRunner.query(`DROP TYPE "public"."gallery_status_gallery_enum"`);
    }

}
