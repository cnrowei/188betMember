/*
 Navicat Premium Data Transfer

 Source Server         : postgresql
 Source Server Type    : PostgreSQL
 Source Server Version : 100003
 Source Host           : localhost:5432
 Source Catalog        : bet18888
 Source Schema         : public

 Target Server Type    : PostgreSQL
 Target Server Version : 100003
 File Encoding         : 65001

 Date: 30/04/2018 17:03:35
*/


-- ----------------------------
-- Table structure for languages
-- ----------------------------
DROP TABLE IF EXISTS "public"."languages";
CREATE TABLE "public"."languages" (
  "id" int4 NOT NULL DEFAULT nextval('language_id_seq'::regclass),
  "code" varchar(50) COLLATE "pg_catalog"."default",
  "descr" varchar(255) COLLATE "pg_catalog"."default",
  "lang" varchar(50) COLLATE "pg_catalog"."default"
)
;
ALTER TABLE "public"."languages" OWNER TO "root";

-- ----------------------------
-- Records of languages
-- ----------------------------
BEGIN;
INSERT INTO "public"."languages" VALUES (1, 'home', '首页(当月业绩概况)', 'zh-CN');
INSERT INTO "public"."languages" VALUES (2, 'creative', '推广工具', 'zh-CN');
INSERT INTO "public"."languages" VALUES (3, 'report', '报表', 'zh-CN');
INSERT INTO "public"."languages" VALUES (4, 'payment', '支付', 'zh-CN');
INSERT INTO "public"."languages" VALUES (5, 'announcement', '通知', 'zh-CN');
INSERT INTO "public"."languages" VALUES (6, 'brand', 'Fourier Lab BRAND', 'zh-CN');
INSERT INTO "public"."languages" VALUES (7, 'aff.comm.by.period', '合作伙伴佣金报表(按月份)', 'zh-CN');
INSERT INTO "public"."languages" VALUES (8, 'aff.collateral.performance', '合作伙伴推广数据报表', 'zh-CN');
INSERT INTO "public"."languages" VALUES (9, 'key.in.name', '请填写名称', 'zh-CN');
INSERT INTO "public"."languages" VALUES (10, 'my.account', '我的账户', 'zh-CN');
INSERT INTO "public"."languages" VALUES (11, 'change.password', '更改密码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (12, 'goto.188', '188金宝博主页', 'zh-CN');
INSERT INTO "public"."languages" VALUES (13, 'contact.us', '联系我们', 'zh-CN');
INSERT INTO "public"."languages" VALUES (14, 'logout', '退出', 'zh-CN');
INSERT INTO "public"."languages" VALUES (15, 'profile', '简要描述', 'zh-CN');
INSERT INTO "public"."languages" VALUES (16, 'help', '帮助', 'zh-CN');
INSERT INTO "public"."languages" VALUES (17, 'promo.type.sub.affiliate', '下级合作伙伴', 'zh-CN');
INSERT INTO "public"."languages" VALUES (18, 'confirm.logout.msg', '确认退出？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (19, 'fill.up.all.required.fields.msg', '请填写所有的必填项目.', 'zh-CN');
INSERT INTO "public"."languages" VALUES (20, 'empty.weburl.msg', '网址未填写', 'zh-CN');
INSERT INTO "public"."languages" VALUES (21, 'confirm.delete.msg', '确定删除？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (22, 'invalid.web.address.msg', '网址无效', 'zh-CN');
INSERT INTO "public"."languages" VALUES (23, 'all', '所有', 'zh-CN');
INSERT INTO "public"."languages" VALUES (24, 'welcome', '欢迎', 'zh-CN');
INSERT INTO "public"."languages" VALUES (25, 'loading', '加载中', 'zh-CN');
INSERT INTO "public"."languages" VALUES (26, 'not.valid.email.msg', '无效电子邮箱', 'zh-CN');
INSERT INTO "public"."languages" VALUES (27, 'more.than.ten.email.msg', '已超过10封电子邮件', 'zh-CN');
INSERT INTO "public"."languages" VALUES (28, 'okayBtn', '好的', 'zh-CN');
INSERT INTO "public"."languages" VALUES (29, 'duplicated.msg', '重复的', 'zh-CN');
INSERT INTO "public"."languages" VALUES (30, 'website.title', '188金宝博合作伙伴管理页面', 'zh-CN');
INSERT INTO "public"."languages" VALUES (31, 'error.amount.must.greater.than.zero', '金额必须大于0', 'zh-CN');
INSERT INTO "public"."languages" VALUES (32, 'error.usd.minimum.payment', '如果支付金额低于100新币则无法办理.', 'zh-CN');
INSERT INTO "public"."languages" VALUES (33, 'black', '背景黑', 'zh-CN');
INSERT INTO "public"."languages" VALUES (34, 'white', '背景白', 'zh-CN');
INSERT INTO "public"."languages" VALUES (35, 'shade', '色彩', 'zh-CN');
INSERT INTO "public"."languages" VALUES (36, 'BO_ANNOUNCE_MGNT', '公告', 'zh-CN');
INSERT INTO "public"."languages" VALUES (37, 'print', '打印', 'zh-CN');
INSERT INTO "public"."languages" VALUES (38, 'current.month', '本月', 'zh-CN');
INSERT INTO "public"."languages" VALUES (39, 'partner.wigan.gloucestershire', '188金宝博荣誉赞助', 'zh-CN');
INSERT INTO "public"."languages" VALUES (40, 'footer', '188金宝博 属于Cube有限公司登记注册。公司注册办事处地址Ground Floor, St George''s Court, Upper Church Street, Douglas, Isle of Man, IM1 1EE<br> 自2007年8月31日起获得马恩岛博彩监管委员会颁发的执照并受其监管（最后更新：31/08/2017）<br>版权所有 © 2018 188金宝博', 'zh-CN');
INSERT INTO "public"."languages" VALUES (41, 'how.it.works', '如何操作', 'zh-CN');
INSERT INTO "public"."languages" VALUES (42, 'commission.plan', '佣金计划', 'zh-CN');
INSERT INTO "public"."languages" VALUES (43, 'promotions', '优惠', 'zh-CN');
INSERT INTO "public"."languages" VALUES (44, 'join.now', '立即加入', 'zh-CN');
INSERT INTO "public"."languages" VALUES (45, 'forgot.password', '忘记密码？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (46, 'username', '用户名称', 'zh-CN');
INSERT INTO "public"."languages" VALUES (47, 'password', '密码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (48, 'login', '登录', 'zh-CN');
INSERT INTO "public"."languages" VALUES (49, 'empty.username.msg', '用户名未填写', 'zh-CN');
INSERT INTO "public"."languages" VALUES (50, 'empty.email.msg', '邮件未填写', 'zh-CN');
INSERT INTO "public"."languages" VALUES (51, 'empty.password.msg', '密码未填写', 'zh-CN');
INSERT INTO "public"."languages" VALUES (52, 'no.security.question.msg', '安全问题并未设置', 'zh-CN');
INSERT INTO "public"."languages" VALUES (53, 'faq', '常见问题与答案', 'zh-CN');
INSERT INTO "public"."languages" VALUES (54, 'continue', '继续', 'zh-CN');
INSERT INTO "public"."languages" VALUES (55, 'cancel', '取消', 'zh-CN');
INSERT INTO "public"."languages" VALUES (56, 'register', '注册会员', 'zh-CN');
INSERT INTO "public"."languages" VALUES (57, 'general.information', '一般信息', 'zh-CN');
INSERT INTO "public"."languages" VALUES (58, 'term.and.condition', '规则与条款', 'zh-CN');
INSERT INTO "public"."languages" VALUES (59, 'register.help.invalidFormat', '账户名可以包含字母（a-z）或数字（0-9）。', 'zh-CN');
INSERT INTO "public"."languages" VALUES (60, 'register.help.invalidLength', '用户名长度必须为5-15位', 'zh-CN');
INSERT INTO "public"."languages" VALUES (61, 'register.help.invalidUserName', '用户名已存在。', 'zh-CN');
INSERT INTO "public"."languages" VALUES (62, 'partner.wigan.warriors', '188金宝博合作伙伴维甘勇士', 'zh-CN');
INSERT INTO "public"."languages" VALUES (63, 'MotherName', '母亲的姓氏？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (64, 'FavorBook', '最喜欢的书的名字？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (65, 'FavorPet', '宠物的名字？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (66, 'FavorMovie', '最喜欢的电影？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (67, 'FavorHobby', '最喜欢的业余爱好？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (68, 'FavorTeam', '最喜欢的运动队？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (69, 'ChildhoodHero', '我童年的英雄？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (70, 'SecretCode', '我的秘密代码？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (71, 'FavorStar', '最喜欢的名人？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (72, 'LifeDream', '我的人生梦想？', 'zh-CN');
INSERT INTO "public"."languages" VALUES (73, 'affiliate.home', '合作伙伴首页', 'zh-CN');
INSERT INTO "public"."languages" VALUES (74, 'your.last.login.on', '上次登录于', 'zh-CN');
INSERT INTO "public"."languages" VALUES (75, 'your.affiliate.id', '您的合作伙伴 ID', 'zh-CN');
INSERT INTO "public"."languages" VALUES (76, 'creative.message', '(请到 {0}选择合适的推广图片.无需下载，只要剪切链接代码并粘贴到您的网站上，图片将会自动显示.)', 'zh-CN');
INSERT INTO "public"."languages" VALUES (77, 'last.updated', '最后更新', 'zh-CN');
INSERT INTO "public"."languages" VALUES (78, 'summary', '概述', 'zh-CN');
INSERT INTO "public"."languages" VALUES (79, 'total.referrals', '总会员', 'zh-CN');
INSERT INTO "public"."languages" VALUES (80, 'quick.summary.of.the.current.month', '当前月份的简述', 'zh-CN');
INSERT INTO "public"."languages" VALUES (81, 'no.of.clicks', '点击次数', 'zh-CN');
INSERT INTO "public"."languages" VALUES (82, 'new.sign.up', '新注册人数', 'zh-CN');
INSERT INTO "public"."languages" VALUES (83, 'new.sign.up.with.deposit', '新注册且存款人数', 'zh-CN');
INSERT INTO "public"."languages" VALUES (84, 'active.referrals', '激活会员', 'zh-CN');
INSERT INTO "public"."languages" VALUES (85, 'commission', '佣金', 'zh-CN');
INSERT INTO "public"."languages" VALUES (86, 'product.summary.of.current.month', '当前月份的产品概述', 'zh-CN');
INSERT INTO "public"."languages" VALUES (87, 'total.active.referrals', '激活会员总计', 'zh-CN');
INSERT INTO "public"."languages" VALUES (88, 'number.of.bets', '投注次数', 'zh-CN');
INSERT INTO "public"."languages" VALUES (89, 'total.stake', '累计投注额', 'zh-CN');
INSERT INTO "public"."languages" VALUES (90, 'company.win.loss', '公司赢利/亏损', 'zh-CN');
INSERT INTO "public"."languages" VALUES (91, 'your.affiliate.link', '您的合作伙伴链接', 'zh-CN');
INSERT INTO "public"."languages" VALUES (92, 'company.loss.message', '公司亏损用负值表示, 比如： -2488', 'zh-CN');
INSERT INTO "public"."languages" VALUES (93, 'no.of.impressions', '浏览数量', 'zh-CN');
INSERT INTO "public"."languages" VALUES (94, 'rake.amount', 'Rake', 'zh-CN');
INSERT INTO "public"."languages" VALUES (95, 'gross.revenue', '收入总额', 'zh-CN');
INSERT INTO "public"."languages" VALUES (96, 'add', '添加', 'zh-CN');
INSERT INTO "public"."languages" VALUES (97, 'language', '语言', 'zh-CN');
INSERT INTO "public"."languages" VALUES (98, 'classification', '类别', 'zh-CN');
INSERT INTO "public"."languages" VALUES (99, 'number', '编号', 'zh-CN');
INSERT INTO "public"."languages" VALUES (100, 'preview', '预览', 'zh-CN');
INSERT INTO "public"."languages" VALUES (101, 'type', '类型', 'zh-CN');
INSERT INTO "public"."languages" VALUES (102, 'size', '尺寸', 'zh-CN');
INSERT INTO "public"."languages" VALUES (103, 'added', '额外的', 'zh-CN');
INSERT INTO "public"."languages" VALUES (104, 'code', '链结代号', 'zh-CN');
INSERT INTO "public"."languages" VALUES (105, 'get.code', '获取代码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (106, 'marketing.link', '推广链接', 'zh-CN');
INSERT INTO "public"."languages" VALUES (107, 'link', '推广链结', 'zh-CN');
INSERT INTO "public"."languages" VALUES (108, 'name', '名称', 'zh-CN');
INSERT INTO "public"."languages" VALUES (110, 'please.copy.msg', '请复制并粘贴上面的文字到您的网站', 'zh-CN');
INSERT INTO "public"."languages" VALUES (112, 'added.date', '添加日期', 'zh-CN');
INSERT INTO "public"."languages" VALUES (114, 'get.QR.code', '生成二维码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (109, 'copy', '复制', 'zh-CN');
INSERT INTO "public"."languages" VALUES (111, 'generate.code', '生成代码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (113, 'QR.code', '二维码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (115, 'referral.listing', '会员名单', 'zh-CN');
INSERT INTO "public"."languages" VALUES (118, 'affiliate.collateral.performance.by.report', '合作伙伴推广数据报表', 'zh-CN');
INSERT INTO "public"."languages" VALUES (119, 'commission.payment.report', '佣金支付报表', 'zh-CN');
INSERT INTO "public"."languages" VALUES (120, 's.no', '序号', 'zh-CN');
INSERT INTO "public"."languages" VALUES (121, 'creative.id', '推广工具编号', 'zh-CN');
INSERT INTO "public"."languages" VALUES (122, 'banner.name', '图片名称', 'zh-CN');
INSERT INTO "public"."languages" VALUES (123, 'banner.size', '图片尺寸', 'zh-CN');
INSERT INTO "public"."languages" VALUES (124, 'media.source', '媒体资源', 'zh-CN');
INSERT INTO "public"."languages" VALUES (125, 'no.new.sign.up', '新注册人数', 'zh-CN');
INSERT INTO "public"."languages" VALUES (126, 'no.sign.up.deposit', '新注册且存款人数', 'zh-CN');
INSERT INTO "public"."languages" VALUES (127, 'percent.click.sign.up', '点击注册的%', 'zh-CN');
INSERT INTO "public"."languages" VALUES (128, 'percent.click.sign.up.deposit', '注册且存款人数/点击数', 'zh-CN');
INSERT INTO "public"."languages" VALUES (129, 'subtotal', '小计', 'zh-CN');
INSERT INTO "public"."languages" VALUES (130, 'submit', '提交', 'zh-CN');
INSERT INTO "public"."languages" VALUES (131, 'date.from', '日期格式', 'zh-CN');
INSERT INTO "public"."languages" VALUES (132, 'date.to', '终止日期', 'zh-CN');
INSERT INTO "public"."languages" VALUES (133, 'excel', 'Excel格式', 'zh-CN');
INSERT INTO "public"."languages" VALUES (134, 'show', '显示', 'zh-CN');
INSERT INTO "public"."languages" VALUES (135, 'refferal.id', '会员帐号', 'zh-CN');
INSERT INTO "public"."languages" VALUES (136, 'registration.date', '注册日期', 'zh-CN');
INSERT INTO "public"."languages" VALUES (137, 'website', '网站', 'zh-CN');
INSERT INTO "public"."languages" VALUES (138, 'country', '国家', 'zh-CN');
INSERT INTO "public"."languages" VALUES (139, 'currency', '合作伙伴货币', 'zh-CN');
INSERT INTO "public"."languages" VALUES (140, 'deposit', '首存金额', 'zh-CN');
INSERT INTO "public"."languages" VALUES (141, 'sum', '总和', 'zh-CN');
INSERT INTO "public"."languages" VALUES (142, 'member.code', '会员帐号', 'zh-CN');
INSERT INTO "public"."languages" VALUES (144, 'month', '月份', 'zh-CN');
INSERT INTO "public"."languages" VALUES (145, 'total', '总共', 'zh-CN');
INSERT INTO "public"."languages" VALUES (146, 'expenses', '支出', 'zh-CN');
INSERT INTO "public"."languages" VALUES (147, 'stake', '投注额', 'zh-CN');
INSERT INTO "public"."languages" VALUES (148, 'company.win.loss.f', '公司赢/输', 'zh-CN');
INSERT INTO "public"."languages" VALUES (149, 'payment.fee', '存提款费用', 'zh-CN');
INSERT INTO "public"."languages" VALUES (150, 'promotion.bonus', '会员红利', 'zh-CN');
INSERT INTO "public"."languages" VALUES (151, 'platform.fee', '平台费', 'zh-CN');
INSERT INTO "public"."languages" VALUES (152, 'company-loss-message', 'company-loss-message', 'zh-CN');
INSERT INTO "public"."languages" VALUES (153, 'commission.balance', '佣金余额', 'zh-CN');
INSERT INTO "public"."languages" VALUES (154, 'no.of.members', '会员数量', 'zh-CN');
INSERT INTO "public"."languages" VALUES (155, 'active.member', '投注会员数量', 'zh-CN');
INSERT INTO "public"."languages" VALUES (156, 'company.revenue', '公司收入', 'zh-CN');
INSERT INTO "public"."languages" VALUES (157, 'month.net.revenue', '本月净赢利', 'zh-CN');
INSERT INTO "public"."languages" VALUES (158, 'negative.balance.brought.over.last.month', '上月累计亏损', 'zh-CN');
INSERT INTO "public"."languages" VALUES (159, 'net.revenue.commission', '佣金净收入', 'zh-CN');
INSERT INTO "public"."languages" VALUES (160, 'cm.revenue.share', '佣金分成', 'zh-CN');
INSERT INTO "public"."languages" VALUES (161, 'commission.earned', '佣金 (SGD)', 'zh-CN');
INSERT INTO "public"."languages" VALUES (162, 'commission.affiliate.currency', '佣金(合作伙伴货币)', 'zh-CN');
INSERT INTO "public"."languages" VALUES (163, 'paid.amount', '已支付金額', 'zh-CN');
INSERT INTO "public"."languages" VALUES (164, 'paid.date', '支付日期', 'zh-CN');
INSERT INTO "public"."languages" VALUES (165, 'adjustment', '调整', 'zh-CN');
INSERT INTO "public"."languages" VALUES (166, 'method', '支付方式', 'zh-CN');
INSERT INTO "public"."languages" VALUES (167, 'withdrawal.amount.affcur', '提款金额(合作伙伴货币)', 'zh-CN');
INSERT INTO "public"."languages" VALUES (168, 'payment.status', '支付狀態', 'zh-CN');
INSERT INTO "public"."languages" VALUES (169, 'transaction.date', '交易日期', 'zh-CN');
INSERT INTO "public"."languages" VALUES (170, 'update.date', '更新日期', 'zh-CN');
INSERT INTO "public"."languages" VALUES (171, 'action', '操作', 'zh-CN');
INSERT INTO "public"."languages" VALUES (172, 'transaction.details', '交易详情', 'zh-CN');
INSERT INTO "public"."languages" VALUES (173, 'transaction.descr', '请选择您的佣金支付方式', 'zh-CN');
INSERT INTO "public"."languages" VALUES (174, 'amount', '金额', 'zh-CN');
INSERT INTO "public"."languages" VALUES (175, 'payment.msg', '佣金转入188BET投注账户后，须进行至少一次全额投注方可提款', 'zh-CN');
INSERT INTO "public"."languages" VALUES (176, 'date.time', '日期/时间', 'zh-CN');
INSERT INTO "public"."languages" VALUES (177, 'email', '邮件', 'zh-CN');
INSERT INTO "public"."languages" VALUES (178, 'status', '状态', 'zh-CN');
INSERT INTO "public"."languages" VALUES (179, 'affiliate.id', '合作编号', 'zh-CN');
INSERT INTO "public"."languages" VALUES (180, 'invite', '邀请', 'zh-CN');
INSERT INTO "public"."languages" VALUES (181, 'subaffiliate.invite', '邀请子合作伙伴', 'zh-CN');
INSERT INTO "public"."languages" VALUES (182, 'subaffiliate.invite.msg', '最多可输入10个电子邮箱地址.例如:user@host.com,anotheruser@host.com (若您需要一次性输入多个邮箱地址时,每个地址间要加入"逗号",并且不可留空白)', 'zh-CN');
INSERT INTO "public"."languages" VALUES (183, 'current.password', '当前密码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (184, 'new.password', '新密码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (185, 'confirm.new.password', '确认新密码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (186, 'affliate.account.information', '合作伙伴账户信息', 'zh-CN');
INSERT INTO "public"."languages" VALUES (187, 'lastname', '姓氏', 'zh-CN');
INSERT INTO "public"."languages" VALUES (188, 'first.name', '名字', 'zh-CN');
INSERT INTO "public"."languages" VALUES (189, 'company', '公司', 'zh-CN');
INSERT INTO "public"."languages" VALUES (190, 'contact.number', '联络电话', 'zh-CN');
INSERT INTO "public"."languages" VALUES (191, 'address', '地址', 'zh-CN');
INSERT INTO "public"."languages" VALUES (192, 'city', '城市/省份', 'zh-CN');
INSERT INTO "public"."languages" VALUES (193, 'postal.code.zip', '邮编', 'zh-CN');
INSERT INTO "public"."languages" VALUES (194, 'massenger', 'QQ/Skype/微信', 'zh-CN');
INSERT INTO "public"."languages" VALUES (195, 'preferred.language', '首选语言', 'zh-CN');
INSERT INTO "public"."languages" VALUES (196, 'preferred.currency', '首选货币', 'zh-CN');
INSERT INTO "public"."languages" VALUES (197, 'website.information', '网站信息', 'zh-CN');
INSERT INTO "public"."languages" VALUES (198, 'i.have.website', '我有自己的网站', 'zh-CN');
INSERT INTO "public"."languages" VALUES (199, 'web.address', '网址', 'zh-CN');
INSERT INTO "public"."languages" VALUES (200, 'promotion.method', '请选择您的首选推广方式', 'zh-CN');
INSERT INTO "public"."languages" VALUES (201, 'i.dont.have.website', '我没有网站', 'zh-CN');
INSERT INTO "public"."languages" VALUES (202, 'update', '更新', 'zh-CN');
INSERT INTO "public"."languages" VALUES (203, 'security.question', '安全问题', 'zh-CN');
INSERT INTO "public"."languages" VALUES (204, 'security.answer', '安全答案', 'zh-CN');
INSERT INTO "public"."languages" VALUES (205, 'additional.information', '附加信息', 'zh-CN');
INSERT INTO "public"."languages" VALUES (206, 'delete', '删除', 'zh-CN');
INSERT INTO "public"."languages" VALUES (207, 'update.security.question.info', '请更新您的安全问题与答案', 'zh-CN');
INSERT INTO "public"."languages" VALUES (208, 'update.transaction.detail.info', '请更新您的银行帐户信息', 'zh-CN');
INSERT INTO "public"."languages" VALUES (209, 'promotion.method.without.website', '如果您没有网站，请描述您将如何推广我们的品牌.', 'zh-CN');
INSERT INTO "public"."languages" VALUES (210, 'click.to.contact.us', '点击<a href="#!/ContactUs">这里</a> 联系我们.', 'zh-CN');
INSERT INTO "public"."languages" VALUES (211, 'sub.forgot.your.password', '忘记密码', 'zh-CN');
INSERT INTO "public"."languages" VALUES (212, 'login.system', '登录系统', 'zh-CN');
INSERT INTO "public"."languages" VALUES (143, 'summary.of.gross.revenue.based.on.product', '公司输赢报表', 'zh-CN');
INSERT INTO "public"."languages" VALUES (116, 'summary.of.win.loss.based.on.product', '公司输赢报表', 'zh-CN');
INSERT INTO "public"."languages" VALUES (117, 'affiliate.commission.reports.by.period', '合作伙伴佣金报表', 'zh-CN');
INSERT INTO "public"."languages" VALUES (213, 'balance', '余额', 'zh-CN');
INSERT INTO "public"."languages" VALUES (214, 'member.credit', '信用额度', 'zh-CN');
INSERT INTO "public"."languages" VALUES (216, 'administration', '管理', 'zh-CN');
INSERT INTO "public"."languages" VALUES (217, 'member.status', '收单状态', 'zh-CN');
INSERT INTO "public"."languages" VALUES (218, 'edit', '编辑', 'zh-CN');
INSERT INTO "public"."languages" VALUES (215, 'online', '在线', 'zh-CN');
INSERT INTO "public"."languages" VALUES (219, 'stop.betting', '停押', 'zh-CN');
INSERT INTO "public"."languages" VALUES (220, 'frozen.account', '冻结', 'zh-CN');
INSERT INTO "public"."languages" VALUES (221, 'nickname', '昵称', 'zh-CN');
INSERT INTO "public"."languages" VALUES (222, 'update.editmember.info', '请添加账号信息', 'zh-CN');
INSERT INTO "public"."languages" VALUES (223, 'setting.balance', '设置账号额度', 'zh-CN');
INSERT INTO "public"."languages" VALUES (224, 'member.role', '会员级别', 'zh-CN');
COMMIT;

-- ----------------------------
-- Primary Key structure for table languages
-- ----------------------------
ALTER TABLE "public"."languages" ADD CONSTRAINT "language_pkey" PRIMARY KEY ("id");
