import { MigrationInterface, QueryRunner } from "typeorm";

export class Addleader1786539542204 implements MigrationInterface {
    name = 'Addleader1786539542204'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "leaders" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying(250) NOT NULL, "position" character varying(150) NOT NULL, "bio" text, "photo" character varying, "email" character varying(255), "phone" character varying(30), "display_order" integer NOT NULL DEFAULT '0', "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_6035d2826e63f39b50a34901d36" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "leaders"`);
    }

}
