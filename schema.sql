-- MySQL dump 10.13  Distrib 8.0.42, for Linux (aarch64)
--
-- Host: 10.0.0.145    Database: shui_13982_com
-- ------------------------------------------------------
-- Server version	9.5.1-cloud

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ '0e93907f-bc7a-11f0-8179-02001700cfad:1-13063';

--
-- Table structure for table `wyu_account`
--

DROP TABLE IF EXISTS `wyu_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_account` (
  `account_id` int unsigned NOT NULL AUTO_INCREMENT,
  `number` varchar(20) DEFAULT NULL COMMENT '编号',
  `mobile` varchar(11) DEFAULT NULL COMMENT '手机号',
  `password` char(32) DEFAULT NULL,
  `role` tinyint(1) DEFAULT '0' COMMENT '0 不可创建新店铺  1可以创建新店铺',
  `num` int DEFAULT '1' COMMENT '可试用创建店铺的数量',
  `username` varchar(20) DEFAULT NULL COMMENT '账号名称',
  `face` varchar(255) DEFAULT NULL COMMENT '头像',
  `code` char(6) DEFAULT NULL COMMENT '登录唯一码',
  `status` tinyint DEFAULT '1' COMMENT '状态1：正常0：冻结',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是，0：否',
  `last_login_time` int DEFAULT NULL COMMENT '最后登录时间',
  `add_time` int DEFAULT NULL COMMENT '添加时间',
  `add_ip` varchar(64) DEFAULT NULL COMMENT '添加是的ip',
  PRIMARY KEY (`account_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COMMENT='平台商户账号表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_activation_code`
--

DROP TABLE IF EXISTS `wyu_activation_code`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_activation_code` (
  `activation_code_id` int unsigned NOT NULL AUTO_INCREMENT,
  `app_id` int DEFAULT '0' COMMENT '应用id',
  `valid_days` int DEFAULT '0' COMMENT '作用天数',
  `price` decimal(10,2) DEFAULT '0.00',
  `activation_code` varchar(255) DEFAULT NULL COMMENT '激活码',
  `expire_time` int DEFAULT NULL COMMENT '过期时间',
  `use_time` int DEFAULT NULL COMMENT '使用时间',
  `status` tinyint DEFAULT '0' COMMENT '状态：1：已使用；0：未使用；',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`activation_code_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb3 COMMENT='激活码表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_admin`
--

DROP TABLE IF EXISTS `wyu_admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_admin` (
  `admin_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) DEFAULT NULL,
  `password` char(32) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `mobile` char(11) DEFAULT NULL,
  `is_lock` tinyint(1) DEFAULT '0',
  `code` char(6) DEFAULT NULL,
  `last_time` int DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`admin_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COMMENT='后台表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_app`
--

DROP TABLE IF EXISTS `wyu_app`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_app` (
  `app_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(40) DEFAULT NULL COMMENT '应用名称',
  `logo` varchar(255) DEFAULT NULL COMMENT '应用图标',
  `type` tinyint DEFAULT NULL COMMENT '应用分类',
  `iden` varchar(20) DEFAULT NULL COMMENT '应用标识',
  `sort` int DEFAULT '999' COMMENT '排序',
  `is_tui` tinyint DEFAULT '0' COMMENT '是否推荐1：推荐；0：不推荐；',
  `white_list` text COMMENT '开发白名单',
  `production_address` varchar(255) DEFAULT NULL COMMENT '生产地址',
  `development_address` varchar(255) DEFAULT NULL COMMENT '开发地址',
  `trial_days` int DEFAULT '0' COMMENT '试用天数',
  `sku` text COMMENT '规格',
  `scene` varchar(255) DEFAULT NULL COMMENT '适用场景',
  `status` tinyint DEFAULT '0' COMMENT '状态0：开发中；1：上架中',
  `is_self` tinyint(1) DEFAULT '0' COMMENT '是否自己维护',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`app_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3 COMMENT='应用表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_app_version`
--

DROP TABLE IF EXISTS `wyu_app_version`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_app_version` (
  `version_id` int unsigned NOT NULL AUTO_INCREMENT,
  `app_id` int DEFAULT NULL,
  `v` varchar(32) DEFAULT NULL,
  `template` varchar(32) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`version_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_customer_service`
--

DROP TABLE IF EXISTS `wyu_customer_service`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_customer_service` (
  `customer_service_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(20) DEFAULT NULL COMMENT '客服名称',
  `qrcode` varchar(255) DEFAULT NULL COMMENT '二维码',
  `mobile` varchar(11) DEFAULT NULL COMMENT '手机号',
  `copyright_img` varchar(255) DEFAULT NULL COMMENT '版权图片',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`customer_service_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb3 COMMENT='客服表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_data_global`
--

DROP TABLE IF EXISTS `wyu_data_global`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_data_global` (
  `k` varchar(32) NOT NULL,
  `v` varchar(1024) DEFAULT '' COMMENT '最长1024字节',
  `last_time` int DEFAULT '0',
  PRIMARY KEY (`k`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=COMPACT;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_data_setting`
--

DROP TABLE IF EXISTS `wyu_data_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_data_setting` (
  `k` varchar(32) NOT NULL,
  `v` text,
  PRIMARY KEY (`k`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_dynamic_article`
--

DROP TABLE IF EXISTS `wyu_dynamic_article`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_dynamic_article` (
  `article_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL COMMENT '标题',
  `cover_img` varchar(255) DEFAULT NULL COMMENT '缩略图',
  `details` text COMMENT '文章详情',
  `sort` int DEFAULT '999' COMMENT '排序',
  `visit_num` int DEFAULT '0' COMMENT '访问量',
  `status` tinyint DEFAULT '1' COMMENT '状态1：上架中；-1:下架中；',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `update_time` int DEFAULT NULL COMMENT '更新时间',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`article_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='动态文章表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_dynamic_case`
--

DROP TABLE IF EXISTS `wyu_dynamic_case`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_dynamic_case` (
  `case_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(30) DEFAULT NULL COMMENT '标题',
  `cover_img` varchar(255) DEFAULT NULL COMMENT '缩略图',
  `app_type` varchar(20) DEFAULT NULL COMMENT '应用分类',
  `details` text COMMENT '案例详情',
  `sort` int DEFAULT '999' COMMENT '排序',
  `visit_num` int DEFAULT '0' COMMENT '访问量',
  `update_time` int DEFAULT NULL COMMENT '更新时间',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`case_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='动态案例表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_dynamic_notice`
--

DROP TABLE IF EXISTS `wyu_dynamic_notice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_dynamic_notice` (
  `notice_id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(50) DEFAULT NULL COMMENT '标题',
  `details` varchar(512) DEFAULT NULL COMMENT '消息详情',
  `text_link` text COMMENT '文字链接',
  `sort` int DEFAULT '999' COMMENT '排序',
  `visit_num` int DEFAULT '0' COMMENT '访问量',
  `status` tinyint DEFAULT '1' COMMENT '状态1：上架中；-1:下架中；',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `update_time` int DEFAULT NULL COMMENT '更新时间',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`notice_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='动态消息表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_img`
--

DROP TABLE IF EXISTS `wyu_img`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_img` (
  `img_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '小程序id',
  `account_id` int DEFAULT '0',
  `from_type` varchar(20) DEFAULT NULL COMMENT '从哪里上传的',
  `hash` varchar(255) DEFAULT NULL COMMENT '七牛云返回量',
  `key` varchar(255) DEFAULT NULL COMMENT '七牛云返回量',
  `url` varchar(255) DEFAULT NULL COMMENT '图片链接',
  `size` double(10,2) DEFAULT '0.00' COMMENT '图片大小',
  `ext` varchar(50) DEFAULT NULL COMMENT '图片格式',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除',
  `is_use` tinyint DEFAULT '0' COMMENT '是否使用',
  `add_time` int DEFAULT NULL COMMENT '添加时间',
  `add_ip` varchar(64) DEFAULT NULL COMMENT '添加时的ip',
  PRIMARY KEY (`img_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=297 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_miniapp_free`
--

DROP TABLE IF EXISTS `wyu_miniapp_free`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_miniapp_free` (
  `free_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `code_type` tinyint(1) DEFAULT '1',
  `legal_persona_wechat` varchar(255) DEFAULT NULL,
  `legal_persona_name` varchar(255) DEFAULT NULL,
  `status` tinyint DEFAULT '0',
  `message` varchar(255) DEFAULT NULL,
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`free_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_order`
--

DROP TABLE IF EXISTS `wyu_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_order` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `type` tinyint(1) DEFAULT NULL COMMENT '1 小程序续费  2充值短信 3线下续费 4激活码续费',
  `app_name` varchar(64) DEFAULT NULL,
  `num` int DEFAULT NULL COMMENT '小程序续费则换算成天数存进来  短信充值则是充值数量',
  `price` decimal(10,2) DEFAULT NULL COMMENT '价格',
  `is_paid` int DEFAULT NULL,
  `payinfo` text COMMENT '支付后返回的流水信息',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=110 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_register_logs`
--

DROP TABLE IF EXISTS `wyu_register_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_register_logs` (
  `register_logs_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `mobile` char(11) DEFAULT NULL COMMENT '手机号',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`register_logs_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1848 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_shop`
--

DROP TABLE IF EXISTS `wyu_shop`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_shop` (
  `shop_id` int unsigned NOT NULL AUTO_INCREMENT,
  `app_id` int DEFAULT '0' COMMENT '应用id',
  `name` varchar(50) DEFAULT NULL COMMENT '商铺名称（修改资料的时候可以修改）',
  `v` varchar(32) DEFAULT '0' COMMENT '当前小程序版本',
  `wx_app_id` varchar(32) DEFAULT NULL COMMENT '微信授权的小程序ID',
  `wx_app_open_id` varchar(32) DEFAULT NULL COMMENT '微信小程序授权的OPEN_ID 就是源ID',
  `wx_auth_key` varchar(512) DEFAULT NULL COMMENT '微信授权的验证秘钥',
  `wx_refresh_token` varchar(512) DEFAULT NULL COMMENT '微信刷新秘钥',
  `wx_face` varchar(255) DEFAULT NULL COMMENT '小程序头像',
  `wx_name` varchar(128) DEFAULT NULL COMMENT '小程序名称',
  `wx_principal_name` varchar(255) DEFAULT NULL COMMENT '小程序的单位',
  `status` tinyint DEFAULT '0' COMMENT '状态 -1 取消授权  0等待授权  1已经授权  8已经上线运营',
  `is_upgrade` tinyint(1) DEFAULT '0' COMMENT '是否升级状态 1 在升级状态一般情况是有一次新版本后始终会是1',
  `code_status` tinyint DEFAULT '0' COMMENT '0等待上传代码 1等待提交审核  2等待审核  4审核失败  5审核通过  6发布上线       \r\n\r\n如果是升级状态 \r\n0就是等待升级  1升级等待提交审核  2升级审核中  4升级审核失败  5升级审核通过 6升级覆盖线上成功',
  `error_msg` text COMMENT '当审核失败的时候的错误',
  `expire_time` int DEFAULT NULL COMMENT '过期时间',
  `customer_service_id` int DEFAULT '0' COMMENT '客服id',
  `type` tinyint DEFAULT '1' COMMENT '1、试用版  2、正式版',
  `urlscheme` varchar(255) DEFAULT NULL COMMENT '小程序的urlscheme',
  `is_multi` tinyint DEFAULT '0' COMMENT '是否多门店',
  `store_num` int DEFAULT '1' COMMENT '门店数量',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`shop_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3 COMMENT='商铺表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_shop_account`
--

DROP TABLE IF EXISTS `wyu_shop_account`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_shop_account` (
  `shop_account_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `account_id` int DEFAULT '0' COMMENT '商户id',
  `role_id` tinyint DEFAULT '1' COMMENT '1:创始人；2：合伙人；',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`shop_account_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COMMENT='商户与商铺关系表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_shop_detail`
--

DROP TABLE IF EXISTS `wyu_shop_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_shop_detail` (
  `shop_id` int unsigned NOT NULL AUTO_INCREMENT,
  `logo` varchar(255) DEFAULT NULL,
  `door_license_plate` varchar(255) DEFAULT NULL COMMENT '门牌照',
  `business_hours` varchar(50) DEFAULT NULL COMMENT '营业时间',
  `tel` varchar(20) DEFAULT NULL COMMENT '电话',
  `company_name` varchar(255) DEFAULT NULL,
  `address` varchar(50) DEFAULT NULL COMMENT '地址',
  `info` varchar(1024) DEFAULT NULL COMMENT '简介',
  `lng` varchar(20) DEFAULT NULL COMMENT '门店地址经度',
  `lat` varchar(20) DEFAULT NULL COMMENT '门店地址维度',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`shop_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='商铺详情表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_shop_gmv_logs`
--

DROP TABLE IF EXISTS `wyu_shop_gmv_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_shop_gmv_logs` (
  `logs_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `balance` decimal(10,2) DEFAULT NULL,
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`logs_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=608 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_shop_payment`
--

DROP TABLE IF EXISTS `wyu_shop_payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_shop_payment` (
  `shop_id` int unsigned NOT NULL AUTO_INCREMENT,
  `type` tinyint(1) DEFAULT '0' COMMENT '0、直连商户\r\n1、服务商支付\r\n',
  `service_mach_id` varchar(32) DEFAULT NULL COMMENT '服务商商户ID',
  `mach_id` varchar(32) DEFAULT NULL,
  `api_auth` varchar(32) DEFAULT NULL,
  `api_cert` text,
  `api_key` text,
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`shop_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_shop_poster`
--

DROP TABLE IF EXISTS `wyu_shop_poster`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_shop_poster` (
  `poster_template_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0',
  `copywriting` varchar(255) DEFAULT NULL COMMENT '文案',
  `back_img` varchar(255) DEFAULT NULL COMMENT '背景图片',
  `qrcode_info` text COMMENT '二维码信息',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`poster_template_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_sms_tpl`
--

DROP TABLE IF EXISTS `wyu_sms_tpl`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_sms_tpl` (
  `tpl_id` int unsigned NOT NULL AUTO_INCREMENT,
  `app_id` int DEFAULT NULL COMMENT '应用',
  `tpl` varchar(512) DEFAULT NULL COMMENT '模版',
  `sms_id` varchar(255) DEFAULT NULL COMMENT '模版ID',
  `key` varchar(32) DEFAULT NULL COMMENT '发送的英文KEY',
  `effect` varchar(255) DEFAULT NULL COMMENT '作用',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`tpl_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='短信通知模版表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_template`
--

DROP TABLE IF EXISTS `wyu_template`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_template` (
  `template_id` int unsigned NOT NULL AUTO_INCREMENT,
  `app_id` int DEFAULT NULL,
  `iden` varchar(32) DEFAULT NULL COMMENT '冗余一下，方便管理',
  `name` varchar(64) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `style` text,
  `is_online` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`template_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_token`
--

DROP TABLE IF EXISTS `wyu_token`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_token` (
  `token` char(32) NOT NULL,
  `type` varchar(20) DEFAULT NULL COMMENT '分类',
  `mobile` varchar(11) DEFAULT NULL,
  `code` varchar(6) DEFAULT NULL,
  `add_time` int DEFAULT '0',
  `add_ip` varchar(32) DEFAULT NULL,
  `expire_time` int DEFAULT '0',
  `code_error_num` int DEFAULT '0',
  PRIMARY KEY (`token`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 COMMENT='token表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_app_setting`
--

DROP TABLE IF EXISTS `wyu_water_app_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_app_setting` (
  `shop_id` int unsigned NOT NULL AUTO_INCREMENT,
  `start_ordering_num` int DEFAULT NULL COMMENT '订水起订量',
  `limit_distance` decimal(10,0) DEFAULT NULL COMMENT '公里',
  `pledge_num` int DEFAULT '0',
  `pledge_photo` varchar(255) DEFAULT NULL,
  `pledge_name` varchar(128) DEFAULT NULL,
  `pledge_money` decimal(10,0) DEFAULT NULL,
  `share_photo` varchar(255) DEFAULT NULL COMMENT '分享图片',
  `share_title` varchar(255) DEFAULT NULL,
  `is_need_deposit` tinyint(1) DEFAULT '0' COMMENT '订水需要缴纳桶押金',
  `is_vip_need_deposit` tinyint(1) DEFAULT '0' COMMENT '会员是否需要缴纳桶押金',
  `wx_appid` varchar(255) DEFAULT NULL COMMENT '微信公众号appid',
  `wx_appsecret` varchar(255) DEFAULT NULL COMMENT '微信公众号appsecret',
  `wx_template_id_1` varchar(255) DEFAULT NULL COMMENT '微信公众号模板消息ID-客户新订单提醒',
  `wx_template_id_2` varchar(255) DEFAULT NULL COMMENT '微信公众号',
  `wx_template_id_3` varchar(255) DEFAULT NULL COMMENT '微信公众号',
  `wx_template_id_4` varchar(255) DEFAULT NULL COMMENT '微信公众号',
  `wx_template_id_5` varchar(255) DEFAULT NULL COMMENT '微信公众号',
  `wx_template_id_6` varchar(255) DEFAULT NULL COMMENT '微信公众号',
  PRIMARY KEY (`shop_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_balance_order`
--

DROP TABLE IF EXISTS `wyu_water_balance_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_balance_order` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `recharge_price` decimal(10,2) DEFAULT NULL,
  `give_price` decimal(10,2) DEFAULT NULL,
  `coupons` text,
  `mendian_id` int DEFAULT '0',
  `is_paid` tinyint(1) DEFAULT '0',
  `payinfo` text,
  `pay_time` int DEFAULT NULL,
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`order_id`) USING BTREE,
  KEY `shop_id` (`shop_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='用户在线充值的ORDER';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_coupon`
--

DROP TABLE IF EXISTS `wyu_water_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_coupon` (
  `coupon_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `name` varchar(30) DEFAULT NULL COMMENT '优惠卷名称',
  `type_id` int DEFAULT '0' COMMENT '1:普通券 2：新人券；3：会员券',
  `start_time` date DEFAULT NULL COMMENT '发放开始时间',
  `end_time` date DEFAULT NULL COMMENT '发放结束时间',
  `valid_bg_time` date DEFAULT NULL COMMENT '有效期开始时间',
  `valid_end_time` date DEFAULT NULL COMMENT '有效期结束时间',
  `coupon_money` decimal(11,2) DEFAULT '0.00' COMMENT '优惠金额',
  `money_limit` decimal(10,2) DEFAULT '0.00' COMMENT '满多少可使用',
  `is_integral_exchange` tinyint DEFAULT '0' COMMENT '是否可用积分兑换',
  `exchange_integral` int DEFAULT '0' COMMENT '兑换需要的积分',
  `quota` int DEFAULT '0' COMMENT '配额：发券数量',
  `take_count` int DEFAULT '0' COMMENT '已领取的优惠券数量',
  `status` tinyint DEFAULT '1' COMMENT '状态1：上架中；-1：下架中；',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `update_time` int DEFAULT NULL COMMENT '更新时间',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`coupon_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='储值小程序优惠卷表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_level`
--

DROP TABLE IF EXISTS `wyu_water_level`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_level` (
  `level_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `name` varchar(20) DEFAULT NULL COMMENT '会员名称',
  `vip_level` int DEFAULT '0' COMMENT '会员等级（从小到大排序）',
  `need_recharge` int DEFAULT '0' COMMENT '所需充值数',
  `discount` decimal(11,1) DEFAULT '10.0' COMMENT '折扣',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1:是；0：否',
  `is_base` tinyint DEFAULT '0' COMMENT '是否是自带1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`level_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=43 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='储值小程序会员等级表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_mall_category`
--

DROP TABLE IF EXISTS `wyu_water_mall_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_mall_category` (
  `category_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `orderby` int DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`category_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_mall_product`
--

DROP TABLE IF EXISTS `wyu_water_mall_product`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_mall_product` (
  `product_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `category_id` int DEFAULT '0',
  `sold_num` int DEFAULT '0',
  `orderby` int DEFAULT '0',
  `is_rent` tinyint(1) DEFAULT '0' COMMENT '是否可以租用',
  `rent_num` int DEFAULT '0' COMMENT '租了多少台',
  `rent_price` decimal(10,2) DEFAULT NULL COMMENT '押金',
  `detail` text COMMENT '详细说明',
  `detail2` text COMMENT '新的详情',
  `unit` varchar(32) DEFAULT NULL COMMENT '单位',
  `is_delete` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`product_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=44 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_mall_product_sku`
--

DROP TABLE IF EXISTS `wyu_water_mall_product_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_mall_product_sku` (
  `sku_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `product_id` int DEFAULT NULL,
  `name` varchar(128) DEFAULT NULL,
  `original_price` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `ticket_id` int DEFAULT NULL COMMENT '水票ID',
  `ticket_num` int DEFAULT '0' COMMENT '包含水票数量',
  `is_delete` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`sku_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member`
--

DROP TABLE IF EXISTS `wyu_water_member`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member` (
  `member_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `open_id` varchar(32) DEFAULT NULL,
  `nick_name` varchar(50) DEFAULT NULL COMMENT '昵称',
  `face` varchar(255) DEFAULT NULL COMMENT '头像',
  `sex` tinyint DEFAULT '1' COMMENT '性别1：男的2：女的',
  `mobile` varchar(11) DEFAULT NULL COMMENT '手机号',
  `level_id` int DEFAULT '0',
  `birthday_year` char(4) DEFAULT NULL COMMENT '生日年份',
  `birthday_month` char(2) DEFAULT NULL COMMENT '生日月份',
  `birthday_day` char(2) DEFAULT NULL COMMENT '生日',
  `pid` int DEFAULT '0' COMMENT '邀请人id',
  `code` char(6) DEFAULT NULL COMMENT '随机数',
  `status` tinyint DEFAULT '1',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `owe_num` int DEFAULT '0' COMMENT '欠桶数量',
  `rank_num` int DEFAULT '0' COMMENT '积分值（用于等级升级使用）',
  `recharge` decimal(10,0) DEFAULT '0' COMMENT '消费总额',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`member_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1930 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='储值商铺会员表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_balance`
--

DROP TABLE IF EXISTS `wyu_water_member_balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_balance` (
  `member_balance_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `member_id` int DEFAULT '0' COMMENT '用户id',
  `balance` decimal(11,2) DEFAULT '0.00' COMMENT '余额',
  `remain_balance` decimal(11,2) DEFAULT '0.00' COMMENT '剩余的余额',
  `valid_bg_time` int DEFAULT NULL COMMENT '开始有效时间',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`member_balance_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=87 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='用户余额表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_balance_logs`
--

DROP TABLE IF EXISTS `wyu_water_member_balance_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_balance_logs` (
  `member_balance_logs_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `member_id` int DEFAULT '0' COMMENT '用户id',
  `type` tinyint DEFAULT NULL COMMENT '分类1：增加；-1：减少',
  `info` varchar(50) DEFAULT NULL COMMENT '说明这此操作',
  `type_id` int DEFAULT NULL COMMENT '具体分类',
  `original_deduction` decimal(11,2) DEFAULT '0.00' COMMENT '原本扣除的金额',
  `balance` decimal(11,2) DEFAULT '0.00' COMMENT '变化的金额',
  `give_balance` decimal(11,2) DEFAULT '0.00' COMMENT '赠送的金额',
  `remarks` varchar(50) DEFAULT NULL COMMENT '备注',
  `mendian_id` int DEFAULT '0' COMMENT '核销的门店',
  `operate_type` tinyint DEFAULT '0' COMMENT '操作人类型0：自己；1：员工；2：运营者',
  `operate_id` int DEFAULT '0' COMMENT '操作者id',
  `operate_mobile` varchar(11) DEFAULT NULL COMMENT '操作者手机号',
  `operate_name` varchar(64) DEFAULT NULL COMMENT '操作者人',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`member_balance_logs_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=379 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='用户余额记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_coupon`
--

DROP TABLE IF EXISTS `wyu_water_member_coupon`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_coupon` (
  `member_coupon_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `member_id` int DEFAULT '0' COMMENT '会员id',
  `type_id` tinyint DEFAULT NULL COMMENT '获取方式1：领取 2：赠送；3：兑换',
  `coupon_id` int DEFAULT '0' COMMENT '优惠卷id',
  `name` varchar(30) DEFAULT NULL COMMENT '优惠卷名称',
  `coupon_money` decimal(11,2) DEFAULT '0.00' COMMENT '优惠金额',
  `money_limit` decimal(10,2) DEFAULT '0.00' COMMENT '满多少可使用',
  `valid_bg_time` date DEFAULT NULL COMMENT '有效开始时间',
  `valid_end_time` date DEFAULT NULL COMMENT '有效结束时间',
  `status` tinyint DEFAULT '0' COMMENT '状态0：待使用；1：已使用',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`member_coupon_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='会员优惠卷表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_coupon_logs`
--

DROP TABLE IF EXISTS `wyu_water_member_coupon_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_coupon_logs` (
  `member_coupon_logs_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `member_id` int DEFAULT '0' COMMENT '用户id',
  `type` tinyint DEFAULT NULL COMMENT '分类：1：获取；-1：使用',
  `type_id` int DEFAULT NULL COMMENT '具体分类',
  `member_coupon_id` int DEFAULT '0' COMMENT '用户拥有的优惠卷',
  `info` varchar(50) DEFAULT NULL COMMENT '说明',
  `mendian_id` int DEFAULT '0' COMMENT '核销的门店',
  `operate_type` tinyint DEFAULT '0' COMMENT '操作人类型0：自己；1：员工；2：运营者',
  `operate_id` int DEFAULT '0' COMMENT '操作者id',
  `operate_mobile` varchar(11) DEFAULT NULL COMMENT '操作者手机号',
  `operate_name` varchar(20) DEFAULT NULL COMMENT '操作者人',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`member_coupon_logs_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='优惠卷记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_deposit`
--

DROP TABLE IF EXISTS `wyu_water_member_deposit`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_deposit` (
  `deposit_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `type` tinyint(1) DEFAULT '0' COMMENT '0 普通租用   1押桶押金 ',
  `order_id` int DEFAULT '0' COMMENT '冗余order_id',
  `member_id` int DEFAULT NULL,
  `mendian_id` int DEFAULT '0',
  `staff_id` int DEFAULT '0',
  `name` varchar(255) DEFAULT NULL COMMENT '租用什么的',
  `num` int DEFAULT '0' COMMENT '租用的数量',
  `price` decimal(10,2) DEFAULT '0.00' COMMENT '租用的单价',
  `photo` varchar(255) DEFAULT NULL COMMENT '图片冗余',
  `deposit` decimal(10,0) DEFAULT '0',
  `status` tinyint(1) DEFAULT '0' COMMENT '0 租用中  1申请退款   2退款中 3等待财务  8退款成功  ',
  `deduct_money` decimal(10,0) DEFAULT '0',
  `check_photo` varchar(255) DEFAULT NULL COMMENT '押金退款的 照片',
  `check_info` varchar(255) DEFAULT NULL COMMENT '和扣款说明',
  `member_bank_type` tinyint(1) DEFAULT '1' COMMENT '1 银行卡  0微信   2支付宝',
  `member_bank` varchar(255) DEFAULT NULL,
  `member_bank_num` varchar(64) DEFAULT NULL,
  `member_real_name` varchar(64) DEFAULT NULL,
  `receiving_name` varchar(64) DEFAULT NULL,
  `receiving_mobile` varchar(32) DEFAULT NULL,
  `address` varchar(512) DEFAULT NULL COMMENT '客户地址',
  `apply_time` int DEFAULT '0',
  `over_time` int DEFAULT NULL,
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`deposit_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=63 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_integral`
--

DROP TABLE IF EXISTS `wyu_water_member_integral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_integral` (
  `member_integral_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `member_id` int DEFAULT '0' COMMENT '用户id',
  `integral` int DEFAULT '0' COMMENT '积分',
  `remain_integral` int DEFAULT '0' COMMENT '剩余积分',
  `expire_time` int DEFAULT NULL COMMENT '过期时间',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`member_integral_id`) USING BTREE,
  KEY `shop_id` (`shop_id`,`member_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='用户积分表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_integral_logs`
--

DROP TABLE IF EXISTS `wyu_water_member_integral_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_integral_logs` (
  `member_integral_logs_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `member_id` int DEFAULT '0' COMMENT '用户id',
  `type` tinyint DEFAULT NULL COMMENT '分类1：增加；-1：减少',
  `type_id` int DEFAULT NULL COMMENT '具体分类',
  `info` varchar(50) DEFAULT NULL COMMENT '这次变化的说明',
  `integral` int DEFAULT '0' COMMENT '变化的积分',
  `remarks` varchar(50) DEFAULT NULL COMMENT '备注',
  `mendian_id` int DEFAULT '0',
  `operate_type` tinyint DEFAULT '0' COMMENT '操作人类型0：自己；1：员工；2：运营者',
  `operate_id` int DEFAULT '0' COMMENT '操作者id',
  `operate_mobile` varchar(11) DEFAULT NULL COMMENT '操作者手机号',
  `operate_name` varchar(20) DEFAULT NULL COMMENT '操作者人',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`member_integral_logs_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='用户积分记录表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_rent`
--

DROP TABLE IF EXISTS `wyu_water_member_rent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_rent` (
  `rent_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `mendian_id` int DEFAULT NULL,
  `staff_id` int DEFAULT '0' COMMENT '处理人（退押金的时候 处理人结单或分配）',
  `name` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `rent_money` decimal(10,2) DEFAULT '0.00',
  `status` tinyint(1) DEFAULT '0' COMMENT '0 租用中  1申请退押金   2上门收货中    8完成',
  `refund_money` decimal(10,2) DEFAULT NULL,
  `refund_info` varchar(255) DEFAULT NULL COMMENT '退款时说明',
  `refund_time` int DEFAULT NULL COMMENT '退款时间',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`rent_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_ticket`
--

DROP TABLE IF EXISTS `wyu_water_member_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_ticket` (
  `member_ticket_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0',
  `type` tinyint DEFAULT '0' COMMENT '来源类型',
  `mendian_id` int DEFAULT '0' COMMENT '统计门店卖出去了多少张水票',
  `member_id` int DEFAULT '0',
  `ticket_id` int DEFAULT NULL,
  `total_num` int DEFAULT '0',
  `residue_num` int DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`member_ticket_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=382 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_member_ticket_logs`
--

DROP TABLE IF EXISTS `wyu_water_member_ticket_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_member_ticket_logs` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `member_ticket_id` int DEFAULT NULL,
  `type` tinyint DEFAULT '0' COMMENT '1 增加 -1减少',
  `ticket_id` int DEFAULT NULL,
  `num` int DEFAULT NULL,
  `type_id` tinyint DEFAULT '0' COMMENT '水票的 增加或减少的具体类型',
  `info` varchar(128) DEFAULT NULL COMMENT 'typeID 对应的中文说明',
  `mendian_id` int DEFAULT '0' COMMENT '如果有操作人 则记录操作人的ID',
  `operate_type` tinyint(1) DEFAULT '0' COMMENT '操作人类型0：自己；1：员工；2：运营者',
  `operate_id` int DEFAULT '0',
  `operate_mobile` varchar(20) DEFAULT NULL,
  `operate_name` varchar(64) DEFAULT NULL,
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1725 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_mendian`
--

DROP TABLE IF EXISTS `wyu_water_mendian`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_mendian` (
  `mendian_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `lat` varchar(32) DEFAULT NULL,
  `lng` varchar(32) DEFAULT NULL,
  `tel` varchar(64) DEFAULT NULL,
  `is_delete` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`mendian_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_order`
--

DROP TABLE IF EXISTS `wyu_water_order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_order` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0',
  `order_type` enum('water','product','rent','ticket') DEFAULT NULL COMMENT '订单类型是  水 还是产品还是 租用  还是 买水票',
  `staff_id` int DEFAULT '0' COMMENT '负责配送的人员',
  `mendian_id` int DEFAULT '0',
  `member_id` int DEFAULT '0',
  `total_price` decimal(10,2) DEFAULT '0.00',
  `need_pay` decimal(10,2) DEFAULT '0.00' COMMENT '如果是订水这个价格为0',
  `youhui_balance` decimal(10,2) DEFAULT '0.00' COMMENT '一般会员折扣优惠的钱',
  `member_coupon_id` int DEFAULT '0',
  `coupon_money` decimal(10,0) DEFAULT '0',
  `pay_type` enum('weixin','money','ticket') DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT '0',
  `status` tinyint DEFAULT '0' COMMENT '0 待支付   1待配送  2配送中   -1取消订单   8订单已完成',
  `is_delete` tinyint(1) DEFAULT '0',
  `pay_time` int DEFAULT '0',
  `pay_info` text,
  `receiving_name` varchar(64) DEFAULT NULL,
  `receiving_mobile` varchar(32) DEFAULT NULL,
  `receiving_address_province` varchar(255) DEFAULT NULL,
  `receiving_address_city` varchar(255) DEFAULT NULL,
  `receiving_address_county` varchar(255) DEFAULT NULL,
  `receiving_address_info` varchar(255) DEFAULT NULL,
  `lng` varchar(20) DEFAULT NULL,
  `lat` varchar(20) DEFAULT NULL,
  `over_time` int DEFAULT '0' COMMENT '订单配送完成的时间',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`order_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2425 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_order_sku`
--

DROP TABLE IF EXISTS `wyu_water_order_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_order_sku` (
  `order_product_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0',
  `order_id` int DEFAULT '0',
  `type` tinyint(1) DEFAULT '0' COMMENT '0 正常商品  1水桶押金',
  `source_id` int DEFAULT '0' COMMENT '原产品ID',
  `source_sku_id` int DEFAULT '0' COMMENT '原SKUID',
  `name` varchar(255) DEFAULT NULL,
  `photo` varchar(255) DEFAULT NULL,
  `sku_name` varchar(255) DEFAULT NULL COMMENT '冗余的SKU的NAME',
  `unit` varchar(32) DEFAULT NULL COMMENT '单位冗余',
  `original_price` decimal(10,2) DEFAULT NULL,
  `price` decimal(10,2) DEFAULT NULL,
  `ticket_id` int DEFAULT '0' COMMENT '如果涉及到水票 冗余',
  `ticket_num` int DEFAULT '0' COMMENT '水票的数量',
  `num` int DEFAULT '0' COMMENT '产品的购买数量',
  PRIMARY KEY (`order_product_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=2446 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_partner`
--

DROP TABLE IF EXISTS `wyu_water_partner`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_partner` (
  `partner_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `role_id` int DEFAULT '3' COMMENT '角色1：股东；2：员工；3：会员;4:自定义',
  `name` varchar(30) DEFAULT NULL COMMENT '姓名',
  `mobile` char(11) DEFAULT NULL COMMENT '手机号',
  `expire_time` date DEFAULT NULL COMMENT '过期时间 只有role_id=1才有用',
  `share_capital` decimal(10,2) DEFAULT '0.00' COMMENT '股金，只有role_id=1才有用',
  `profit` decimal(10,2) DEFAULT '0.00' COMMENT '总收益',
  `withdrawable_profit` decimal(10,2) DEFAULT '0.00' COMMENT '可提现收益',
  `custom_name` varchar(255) DEFAULT NULL COMMENT '自定义名称 只有role_id=4才有用',
  `custom_rate` decimal(10,2) DEFAULT '0.00' COMMENT '自定义比例 只有role_id=4才有用',
  `status` tinyint DEFAULT '1' COMMENT '状态1：正常；-1退股',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`partner_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_partner_commission`
--

DROP TABLE IF EXISTS `wyu_water_partner_commission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_partner_commission` (
  `commission_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `partner_id` int DEFAULT NULL,
  `member_id` int DEFAULT NULL,
  `month` varchar(8) DEFAULT NULL COMMENT '格式   2021-01 ',
  `monetary` decimal(10,2) DEFAULT NULL COMMENT '消费金额',
  `commission` decimal(10,2) DEFAULT NULL COMMENT '佣金',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`commission_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb3 COMMENT='合伙人业绩表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_partner_setting`
--

DROP TABLE IF EXISTS `wyu_water_partner_setting`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_partner_setting` (
  `partner_setting_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `dividend_ratio_data` text COMMENT '股东合伙人股金设置',
  `is_bind_shareholder` tinyint DEFAULT '0' COMMENT '股东是否绑定已有用户',
  `commission_data` text COMMENT '员工合伙人业绩设置',
  `is_bind_employee` tinyint DEFAULT '0' COMMENT '员工是否绑定已有用户',
  `commission` decimal(10,2) DEFAULT '0.00' COMMENT '会员合伙人佣金比例',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`partner_setting_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_partner_withdraw`
--

DROP TABLE IF EXISTS `wyu_water_partner_withdraw`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_partner_withdraw` (
  `withdraw_id` int unsigned NOT NULL AUTO_INCREMENT COMMENT '佣金提现表',
  `shop_id` int DEFAULT NULL,
  `partner_id` int DEFAULT NULL COMMENT '推广员',
  `open_id` varchar(64) DEFAULT NULL,
  `money` decimal(10,2) DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0' COMMENT '0 待审核  1提现成功',
  `pay_time` int DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`withdraw_id`) USING BTREE,
  KEY `shop_id` (`shop_id`,`partner_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_recommend_app`
--

DROP TABLE IF EXISTS `wyu_water_recommend_app`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_recommend_app` (
  `recommend_app_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `logo` varchar(255) DEFAULT NULL COMMENT 'logo',
  `name` varchar(20) DEFAULT NULL COMMENT '小程序名称',
  `app_id` varchar(255) DEFAULT NULL COMMENT '推荐小程序app_id',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`recommend_app_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='推荐小程序表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_setting_balance`
--

DROP TABLE IF EXISTS `wyu_water_setting_balance`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_setting_balance` (
  `setting_balance_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `integral_deduction_balance_limit_rate` decimal(11,2) DEFAULT '0.00' COMMENT '积分抵扣余额上限比',
  `taocan_detail` text COMMENT '余额充值套餐',
  `is_frozen_give_money` tinyint DEFAULT '0' COMMENT '是否冻结赠送天数',
  `frozen_days` int DEFAULT '0' COMMENT '冻结天数',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`setting_balance_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='余额设置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_setting_integral`
--

DROP TABLE IF EXISTS `wyu_water_setting_integral`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_setting_integral` (
  `setting_integral_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `integral_exchange_balance` decimal(11,2) DEFAULT '0.00' COMMENT '积分抵扣余额',
  `recharge_give_integral_rate` decimal(11,2) DEFAULT '0.00' COMMENT '充值赠送积分比例（%）',
  `is_expire` tinyint DEFAULT '1' COMMENT '是否过期1:是；0：否',
  `valid_year` int DEFAULT '1' COMMENT '有效期（年）',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`setting_integral_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='积分设置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_setting_sms`
--

DROP TABLE IF EXISTS `wyu_water_setting_sms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_setting_sms` (
  `setting_sms_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `sms_num` int DEFAULT '0' COMMENT '剩余短信数量',
  `integral_change_notice` tinyint DEFAULT '0' COMMENT '积分变动通知1：通知；0：不通知',
  `balance_change_notice` tinyint DEFAULT '0' COMMENT '余额变动通知1：通知；0：不通知',
  `order_delivery` tinyint DEFAULT '0' COMMENT '订单派送通知',
  `paidan` tinyint(1) DEFAULT '0',
  `jiedan` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`setting_sms_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='短信设置表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_shop_staff`
--

DROP TABLE IF EXISTS `wyu_water_shop_staff`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_shop_staff` (
  `staff_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `mendian_id` int DEFAULT '0' COMMENT '所属门店',
  `mobile` varchar(11) DEFAULT NULL COMMENT '员工手机号',
  `name` varchar(20) DEFAULT NULL COMMENT '员工名称',
  `dispatch_order` tinyint DEFAULT '0' COMMENT '派单权限',
  `write_off_jurisdiction` tinyint DEFAULT '0' COMMENT '核销权限',
  `add_value_jurisdiction` mediumtext COMMENT '加值权限',
  `delivery_clerk` tinyint DEFAULT NULL COMMENT '是否是送货员',
  `last_time` int DEFAULT NULL COMMENT '上一次登录时间',
  `status` tinyint DEFAULT '1' COMMENT '状态1：正常；0：离职',
  `is_delete` tinyint DEFAULT '0' COMMENT '是否删除1：是；0：否',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  `openid` varchar(255) DEFAULT NULL COMMENT '微信模板消息id',
  PRIMARY KEY (`staff_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='储值小程序员工表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_sms_recharge`
--

DROP TABLE IF EXISTS `wyu_water_sms_recharge`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_sms_recharge` (
  `sms_recharge_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `type` tinyint(1) DEFAULT NULL COMMENT '类型',
  `info` varchar(50) DEFAULT NULL COMMENT '说明',
  `sms_num` int DEFAULT '0' COMMENT '充值条数',
  `money` decimal(11,2) DEFAULT '0.00' COMMENT '花费金额',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`sms_recharge_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='短信充值记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_sms_send`
--

DROP TABLE IF EXISTS `wyu_water_sms_send`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_sms_send` (
  `sms_send_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT '0' COMMENT '商铺id',
  `mobile` varchar(11) DEFAULT NULL COMMENT '发送手机号',
  `send_type` varchar(255) DEFAULT NULL COMMENT '发送类型',
  `after_sms_num` int DEFAULT '0' COMMENT '剩余短信条数',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(64) DEFAULT NULL,
  PRIMARY KEY (`sms_send_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=1002 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC COMMENT='短信发送记录';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_style`
--

DROP TABLE IF EXISTS `wyu_water_style`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_style` (
  `shop_id` int NOT NULL,
  `style` text,
  PRIMARY KEY (`shop_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_ticket`
--

DROP TABLE IF EXISTS `wyu_water_ticket`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_ticket` (
  `water_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `water_name` varchar(255) DEFAULT NULL COMMENT '水的标题名称',
  `ticket_name` varchar(255) DEFAULT NULL COMMENT '票的标题名称',
  `photo` varchar(255) DEFAULT NULL,
  `water_original_price` decimal(10,2) DEFAULT NULL COMMENT '水的价格',
  `water_price` decimal(10,2) DEFAULT NULL COMMENT '水票价格（现在购买水的价格）',
  `sold_num` int DEFAULT '0',
  `orderby` int DEFAULT NULL COMMENT '排序',
  `is_delete` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`water_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=46 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_water_ticket_sku`
--

DROP TABLE IF EXISTS `wyu_water_ticket_sku`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_water_ticket_sku` (
  `sku_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `water_id` int DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `num` int DEFAULT '0' COMMENT '总数量',
  `price` decimal(10,2) DEFAULT NULL COMMENT '总价',
  `sold_num` int DEFAULT '0',
  `is_delete` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`sku_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=51 DEFAULT CHARSET=utf8mb3 ROW_FORMAT=DYNAMIC;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_wwopen_logs`
--

DROP TABLE IF EXISTS `wyu_wwopen_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_wwopen_logs` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `mobile` char(11) DEFAULT NULL COMMENT '来访用户，如果空 则代表是游客',
  `is_staff` tinyint(1) DEFAULT '0',
  `staff_mobile` char(11) DEFAULT NULL,
  `nick_name` varchar(64) DEFAULT NULL,
  `face` varchar(255) DEFAULT NULL,
  `type` tinyint DEFAULT '0' COMMENT '页面类型',
  `page_id` int DEFAULT '0' COMMENT '页面ID默认为0 仅仅是冗余，为了方便判断今天第几次访问',
  `info` varchar(255) DEFAULT NULL COMMENT '访问的页面内容（如果是详情页就写详情的标题比如产品：***，如果其他页面就是页面标题）',
  `day` date DEFAULT NULL COMMENT '访问的日期',
  `num` int DEFAULT '0' COMMENT '插入前查询',
  `t` int DEFAULT '0' COMMENT '单位秒，开始不统计，后期增加统计',
  `is_send` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL COMMENT '如果是游客的情况则',
  PRIMARY KEY (`log_id`) USING BTREE,
  KEY `shop_id` (`shop_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=19887 DEFAULT CHARSET=utf8mb3 COMMENT='访问提醒表' SECONDARY_ENGINE=RAPID;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_wwopen_order_logs`
--

DROP TABLE IF EXISTS `wyu_wwopen_order_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_wwopen_order_logs` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `type` tinyint(1) DEFAULT '0',
  `type_means` varchar(64) DEFAULT NULL,
  `mobile` char(11) DEFAULT NULL,
  `money` decimal(10,2) DEFAULT NULL,
  `day` date DEFAULT NULL,
  `info` varchar(255) DEFAULT NULL,
  `is_send` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=895 DEFAULT CHARSET=utf8mb3 COMMENT='订单提醒表';
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_wwopen_staff_notice_logs`
--

DROP TABLE IF EXISTS `wyu_wwopen_staff_notice_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_wwopen_staff_notice_logs` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT,
  `shop_id` int DEFAULT NULL,
  `mobile` char(11) DEFAULT NULL,
  `staff_mobile` char(11) DEFAULT NULL COMMENT '要通知的员工',
  `info` varchar(512) DEFAULT NULL,
  `day` date DEFAULT NULL,
  `is_send` tinyint(1) DEFAULT '0',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_wwopen_store`
--

DROP TABLE IF EXISTS `wyu_wwopen_store`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_wwopen_store` (
  `store_id` int unsigned NOT NULL AUTO_INCREMENT,
  `corp_name` varchar(255) DEFAULT NULL,
  `corp_id` varchar(32) DEFAULT NULL,
  `permanent_code` varchar(512) DEFAULT NULL,
  `corp_square_logo_url` varchar(512) DEFAULT NULL,
  `agent_id` int DEFAULT NULL,
  `status` tinyint(1) DEFAULT '0' COMMENT '1 正常  -1 已取消',
  `corp_wxqrcode` varchar(512) DEFAULT NULL COMMENT '企业号的微信二维码',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`store_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_wwopen_store_customer`
--

DROP TABLE IF EXISTS `wyu_wwopen_store_customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_wwopen_store_customer` (
  `customer_id` int unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int DEFAULT NULL,
  `mobile` varchar(11) DEFAULT NULL,
  `user_id` varchar(64) DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `nick_name` varchar(64) DEFAULT NULL,
  `adviser_user_id` varchar(64) DEFAULT NULL,
  `adviser_mobile` varchar(11) DEFAULT NULL,
  `tag` text,
  `info` varchar(512) DEFAULT NULL COMMENT '备注',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`customer_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_wwopen_store_customer_logs`
--

DROP TABLE IF EXISTS `wyu_wwopen_store_customer_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_wwopen_store_customer_logs` (
  `log_id` int unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int DEFAULT NULL,
  `customer_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `info` varchar(512) DEFAULT NULL,
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`log_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_wwopen_store_shop_map`
--

DROP TABLE IF EXISTS `wyu_wwopen_store_shop_map`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_wwopen_store_shop_map` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int DEFAULT NULL,
  `shop_id` int DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `wyu_wwopen_store_user`
--

DROP TABLE IF EXISTS `wyu_wwopen_store_user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `wyu_wwopen_store_user` (
  `store_uid` int unsigned NOT NULL AUTO_INCREMENT,
  `store_id` int DEFAULT NULL,
  `name` varchar(64) DEFAULT NULL,
  `mobile` char(11) DEFAULT NULL,
  `auth` text COMMENT 'view,order,notice',
  `user_id` varchar(32) DEFAULT NULL COMMENT '对应的商家通讯录的userid',
  `add_time` int DEFAULT NULL,
  `add_ip` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`store_uid`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-13  9:51:50
