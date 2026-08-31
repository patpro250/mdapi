import { MigrationInterface, QueryRunner } from "typeorm";

export class Gen1786975899462 implements MigrationInterface {
    name = 'Gen1786975899462'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TYPE "public"."users_ac_status_enum" ADD VALUE 'PENDING'`);
        await queryRunner.query(`ALTER TYPE "public"."posts_status_enum" ADD VALUE 'DELETED'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."posts_status_enum_old" AS ENUM('DRAFT', 'PUBLISHED')`);
        await queryRunner.query(`ALTER TABLE "posts" ALTER COLUMN "status" TYPE "public"."posts_status_enum_old" USING "status"::"text"::"public"."posts_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."posts_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."posts_status_enum_old" RENAME TO "posts_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."users_ac_status_enum_old" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "Ac_Status" TYPE "public"."users_ac_status_enum_old" USING "Ac_Status"::"text"::"public"."users_ac_status_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."users_ac_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."users_ac_status_enum_old" RENAME TO "users_ac_status_enum"`);
    }

}
