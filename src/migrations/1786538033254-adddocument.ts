import { MigrationInterface, QueryRunner } from "typeorm";

export class Adddocument1786538033254 implements MigrationInterface {
    name = 'Adddocument1786538033254'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "documents" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(255) NOT NULL, "description" text, "category" character varying(100) NOT NULL, "file_name" character varying(255) NOT NULL, "file_url" character varying NOT NULL, "object_name" character varying NOT NULL, "mime_type" character varying(100) NOT NULL, "file_size" bigint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_ac51aa5181ee2036f5ca482857c" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "documents"`);
    }

}
