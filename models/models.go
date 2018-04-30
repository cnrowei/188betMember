package models

import (
	"fmt"
	"time"

	//_ "github.com/go-sql-driver/mysql"

	"github.com/jinzhu/gorm"
	_ "github.com/lib/pq"
)

var (
	db *gorm.DB
)

func init() {
	var err error
	db, err = gorm.Open("postgres", fmt.Sprintf("postgres://%v:%v@localhost/%v?sslmode=disable", "root", "ishgishg", "bet18888"))
	if err != nil {
		panic(err)
	} else {

		// 创建数据库
		db.AutoMigrate(&Languages{})
		db.Debug()
		db.LogMode(true)
	}
}

type Languages struct {
	Id    int64  `json:""`
	Code  string `xorm:"varchar(50)" json:"Code"`  //標示代碼
	Descr string `xorm:"varchar(50)" json:"Descr"` //字意
	Lang  string `xorm:"varchar(50)"`              //語言
}

//添加語言
func AddLanguage(code, descr, lang string) (int64, error) {
	add := &Languages{Code: code, Descr: descr, Lang: lang}

	err := db.Create(add).Error
	if err == nil {
		return add.Id, nil
	} else {
		return 0, err
	}
}

func GetByLanguage(code, lang string) (int64, error) {
	lan := &Languages{}
	if err := db.Where("code=? and lang=?", code, lang).Find(lan).Error; err == nil {
		return lan.Id, err
	} else {
		return 0, err
	}
}

//获取字母列表
func GetLnaguageList(where string) (*[]Languages, error) {
	lan := &[]Languages{}
	err := db.Where(where).Select("code,descr").Find(lan).Error
	return lan, err
}

type Users struct {
	Id         int64     `gorm:"AUTO_INCREMENT" json:"id"`
	Username   string    `gorm:"size:50" json:"username"`
	Password   string    `gorm:"size:50" json:"password"`
	Nickname   string    `gorm:"size:50" json:"nickname"` //昵称
	Agentid    int64     `gorm:"index"  json:"agent"`     //上级代理的ID，0为普通代理
	Role       int       `json:"role"`                    //用户角色系统管理3、总代理2、代理1、会员0
	Currency   string    `json:"currency"`                //货币类型 “RMB"
	Balance    float64   `json:"balance"`                 //财务额度
	Credit     float64   `json:"credit"`                  //信用额度
	Nowbalance float64   `json:"nowbalance"`              //当前信用额度
	Btccoin    float64   `json:"btccoin"`                 //btc
	Ethcoin    float64   `json:"btccoin"`                 //eth
	Ltbcoin    float64   `json:"btccoin"`                 //ltb
	Online     bool      `json:"online"`                  //是否在线
	Login      bool      `json:"Login"`                   //账号状态
	Odds       string    `json:"odds"`                    //赔率盘口
	Status     bool      `json:"status"`                  //是否收单
	Created    time.Time `json:"created"`                 //添加时间
	Updated    time.Time `json:"updated"`                 //更新时间
}

//获取用户信息
func GetUserInfo(username string) (*Users, error) {
	var user = &Users{}
	err := db.Where("username = ?", username).Find(user).Error
	if err == nil {
		return user, err
	} else {
		return nil, err
	}
}

//获取用户列表
func GetUsers(desc string) (*[]Users, error) {
	list := &[]Users{}
	err := db.Order(desc).Find(list).Error
	return list, err
}

//根据角色获取代理
func GetUsersByRole(role int64, offset int, limit int, field string) (*[]Users, error) {
	users := &[]Users{}
	err := db.Where("role=?", role).Order(field).Order("Created").Find(users).Error
	return users, err
}

//更新密码
func UpUserpass(uid int64, usr *Users) (int64, error) {
	//var user = &Users{}
	err := db.Model(Users{}).UpdateColumns(usr).Error
	return usr.Id, err
}

//更新用户余额
func UpUserBalance(uid int64, balance float64) error {
	usr := &[]Users{}
	err := db.Model(&usr).Where("id=?", uid).Updates(Users{Balance: balance}).Error
	return err
}

//通知公告
type Announcement struct {
	Id int64 `json:"id"`
}

//添加新的用户
func NewUsers(user *Users) (int64, error) {
	err := db.Create(&user).Error
	if err == nil {
		return user.Id, nil
	} else {
		return 0, err
	}
}

//查找用户
func FindUser(username string) (*Users, error) {
	users := &Users{}
	//return db.Where("username = ?", username).First(users).RecordNotFound()
	err := db.Where("username = ?", username).First(users).Error

	if err == nil {
		return users, nil
	} else {
		return nil, err
	}
}

/*
user := Users{Id: 1, Username: "admin", Password: "498619c053f00fd6", Agentid: 0, Role: 3, Currency: "RMB", Odds: "A", Status: true, Login: true, Created: time.Now(), Updated: time.Now()}
if has := db.NewRecord(&user); has {
	db.Create(&user)
}
*/
