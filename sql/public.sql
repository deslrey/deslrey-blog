/*
 Navicat Premium Data Transfer

 Source Server         : 185.227.153.27
 Source Server Type    : PostgreSQL
 Source Server Version : 160001 (160001)
 Source Host           : 185.227.153.27:5432
 Source Catalog        : deslreyblog
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 160001 (160001)
 File Encoding         : 65001

 Date: 09/03/2026 09:21:47
*/


-- ----------------------------
-- Sequence structure for article_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."article_id_seq";
CREATE SEQUENCE "public"."article_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for category_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."category_id_seq";
CREATE SEQUENCE "public"."category_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for draft_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."draft_id_seq";
CREATE SEQUENCE "public"."draft_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for folder_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."folder_id_seq";
CREATE SEQUENCE "public"."folder_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for image_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."image_id_seq";
CREATE SEQUENCE "public"."image_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for tag_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."tag_id_seq";
CREATE SEQUENCE "public"."tag_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for user_info_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."user_info_id_seq";
CREATE SEQUENCE "public"."user_info_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Sequence structure for visit_log_id_seq
-- ----------------------------
DROP SEQUENCE IF EXISTS "public"."visit_log_id_seq";
CREATE SEQUENCE "public"."visit_log_id_seq" 
INCREMENT 1
MINVALUE  1
MAXVALUE 9223372036854775807
START 1
CACHE 1;

-- ----------------------------
-- Table structure for article
-- ----------------------------
DROP TABLE IF EXISTS "public"."article";
CREATE TABLE "public"."article" (
  "id" int8 NOT NULL DEFAULT nextval('article_id_seq'::regclass),
  "title" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default",
  "word_count" int8,
  "views" int8,
  "read_time" int8,
  "category_id" int8,
  "des" text COLLATE "pg_catalog"."default",
  "sticky" bool,
  "edit" bool,
  "exist" bool,
  "create_time" timestamptz(6),
  "update_time" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for article_tag
-- ----------------------------
DROP TABLE IF EXISTS "public"."article_tag";
CREATE TABLE "public"."article_tag" (
  "article_id" int8 NOT NULL,
  "tag_id" int8 NOT NULL
)
;

-- ----------------------------
-- Table structure for category
-- ----------------------------
DROP TABLE IF EXISTS "public"."category";
CREATE TABLE "public"."category" (
  "id" int8 NOT NULL DEFAULT nextval('category_id_seq'::regclass),
  "title" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for draft
-- ----------------------------
DROP TABLE IF EXISTS "public"."draft";
CREATE TABLE "public"."draft" (
  "id" int8 NOT NULL DEFAULT nextval('draft_id_seq'::regclass),
  "article_id" int8,
  "title" text COLLATE "pg_catalog"."default",
  "content" text COLLATE "pg_catalog"."default",
  "des" text COLLATE "pg_catalog"."default",
  "create_time" timestamptz(6),
  "update_time" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for folder
-- ----------------------------
DROP TABLE IF EXISTS "public"."folder";
CREATE TABLE "public"."folder" (
  "id" int8 NOT NULL DEFAULT nextval('folder_id_seq'::regclass),
  "folder_name" text COLLATE "pg_catalog"."default",
  "path" text COLLATE "pg_catalog"."default",
  "create_time" timestamptz(6),
  "update_time" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for image
-- ----------------------------
DROP TABLE IF EXISTS "public"."image";
CREATE TABLE "public"."image" (
  "id" int8 NOT NULL DEFAULT nextval('image_id_seq'::regclass),
  "folder_id" int8,
  "image_name" text COLLATE "pg_catalog"."default",
  "origin_name" text COLLATE "pg_catalog"."default",
  "path" text COLLATE "pg_catalog"."default",
  "url" text COLLATE "pg_catalog"."default",
  "size" int8,
  "create_time" timestamptz(6)
)
;

-- ----------------------------
-- Table structure for tag
-- ----------------------------
DROP TABLE IF EXISTS "public"."tag";
CREATE TABLE "public"."tag" (
  "id" int8 NOT NULL DEFAULT nextval('tag_id_seq'::regclass),
  "title" text COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Table structure for user_info
-- ----------------------------
DROP TABLE IF EXISTS "public"."user_info";
CREATE TABLE "public"."user_info" (
  "id" int8 NOT NULL DEFAULT nextval('user_info_id_seq'::regclass),
  "user_name" text COLLATE "pg_catalog"."default",
  "pass_word" text COLLATE "pg_catalog"."default",
  "email" text COLLATE "pg_catalog"."default",
  "salt" text COLLATE "pg_catalog"."default",
  "avatar" text COLLATE "pg_catalog"."default",
  "create_time" timestamptz(6),
  "update_time" timestamptz(6),
  "exist" bool
)
;

-- ----------------------------
-- Table structure for visit_log
-- ----------------------------
DROP TABLE IF EXISTS "public"."visit_log";
CREATE TABLE "public"."visit_log" (
  "id" int8 NOT NULL DEFAULT nextval('visit_log_id_seq'::regclass),
  "ip" varchar(50) COLLATE "pg_catalog"."default",
  "location" varchar(100) COLLATE "pg_catalog"."default",
  "user_agent" varchar(255) COLLATE "pg_catalog"."default",
  "referer" varchar(255) COLLATE "pg_catalog"."default",
  "path" varchar(255) COLLATE "pg_catalog"."default",
  "visit_time" timestamptz(6) NOT NULL DEFAULT now(),
  "device" varchar(50) COLLATE "pg_catalog"."default"
)
;

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."article_id_seq"
OWNED BY "public"."article"."id";
SELECT setval('"public"."article_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."category_id_seq"
OWNED BY "public"."category"."id";
SELECT setval('"public"."category_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."draft_id_seq"
OWNED BY "public"."draft"."id";
SELECT setval('"public"."draft_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."folder_id_seq"
OWNED BY "public"."folder"."id";
SELECT setval('"public"."folder_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."image_id_seq"
OWNED BY "public"."image"."id";
SELECT setval('"public"."image_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."tag_id_seq"
OWNED BY "public"."tag"."id";
SELECT setval('"public"."tag_id_seq"', 2, true);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."user_info_id_seq"
OWNED BY "public"."user_info"."id";
SELECT setval('"public"."user_info_id_seq"', 1, false);

-- ----------------------------
-- Alter sequences owned by
-- ----------------------------
ALTER SEQUENCE "public"."visit_log_id_seq"
OWNED BY "public"."visit_log"."id";
SELECT setval('"public"."visit_log_id_seq"', 282, true);

-- ----------------------------
-- Primary Key structure for table article
-- ----------------------------
ALTER TABLE "public"."article" ADD CONSTRAINT "article_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table article_tag
-- ----------------------------
ALTER TABLE "public"."article_tag" ADD CONSTRAINT "article_tag_pkey" PRIMARY KEY ("article_id", "tag_id");

-- ----------------------------
-- Primary Key structure for table category
-- ----------------------------
ALTER TABLE "public"."category" ADD CONSTRAINT "category_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table draft
-- ----------------------------
ALTER TABLE "public"."draft" ADD CONSTRAINT "draft_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table folder
-- ----------------------------
ALTER TABLE "public"."folder" ADD CONSTRAINT "folder_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table image
-- ----------------------------
ALTER TABLE "public"."image" ADD CONSTRAINT "image_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table tag
-- ----------------------------
ALTER TABLE "public"."tag" ADD CONSTRAINT "tag_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table user_info
-- ----------------------------
ALTER TABLE "public"."user_info" ADD CONSTRAINT "user_info_pkey" PRIMARY KEY ("id");

-- ----------------------------
-- Primary Key structure for table visit_log
-- ----------------------------
ALTER TABLE "public"."visit_log" ADD CONSTRAINT "visit_log_pkey" PRIMARY KEY ("id");
