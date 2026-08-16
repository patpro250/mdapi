import { MigrationInterface, QueryRunner } from "typeorm";

export class Addaccountstatusonuser1786704808286 implements MigrationInterface {
    name = 'Addaccountstatusonuser1786704808286'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "is_active" TO "Ac_Status"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "Ac_Status"`);
        await queryRunner.query(`CREATE TYPE "public"."users_ac_status_enum" AS ENUM('ACTIVE', 'INACTIVE', 'SUSPENDED', 'DELETED')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "Ac_Status" "public"."users_ac_status_enum" NOT NULL DEFAULT 'ACTIVE'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "Ac_Status"`);
        await queryRunner.query(`DROP TYPE "public"."users_ac_status_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "Ac_Status" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "Ac_Status" TO "is_active"`);
    }

}
