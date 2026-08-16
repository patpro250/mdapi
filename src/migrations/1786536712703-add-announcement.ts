import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnnouncement1786536712703 implements MigrationInterface {
    name = 'AddAnnouncement1786536712703'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."announcements_status_enum" AS ENUM('DRAFT', 'PUBLISHED', 'EXPIRED')`);
        await queryRunner.query(`CREATE TABLE "announcements" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(455) NOT NULL, "content" text NOT NULL, "status" "public"."announcements_status_enum" NOT NULL DEFAULT 'DRAFT', "priority" integer NOT NULL DEFAULT '0', "published_at" TIMESTAMP, "expires_at" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_b3ad760876ff2e19d58e05dc8b0" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "announcements"`);
        await queryRunner.query(`DROP TYPE "public"."announcements_status_enum"`);
    }

}
