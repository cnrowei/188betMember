package models

import (
	"errors"
	"time"

	//_ "github.com/go-sql-driver/mysql"
	"github.com/go-xorm/xorm"
	_ "github.com/lib/pq"
)

const (
	dbtype = "PGSQL"
	//dbtype = "MYSQL"
	//dbtype = "SQLITE"
)

var engine *xorm.Engine

func init() {

	engine, err := SetEngine()

	if err != nil {
		panic(err)
	}
	if err := CreatTables(engine); err != nil {
		panic(err)
	}
}

func ConDb() (*xorm.Engine, error) {
	switch {
	case dbtype == "SQLITE":
		return xorm.NewEngine("sqlite3", "./data/sqlite.db")

	case dbtype == "MYSQL":
		return xorm.NewEngine("mysql", "root:YouPass@/db?charset=utf8")

	case dbtype == "PGSQL":
		// "user=postgres password=jn!@#$%^&* dbname=yougam sslmode=disable maxcons=10 persist=true"
		//return xorm.NewEngine("postgres", "host=110.76.39.205 user=postgres password=jn!@#$%^&* dbname=yougam sslmode=disable")
		return xorm.NewEngine("postgres", "user=root password=ishgishg dbname=bet18888 sslmode=disable")
		//return xorm.NewEngine("postgres", "host=127.0.0.1 port=6432 user=postgres password=jn!@#$%^&* dbname=yougam sslmode=disable")
	}
	return nil, errors.New("尚未设定数据库连接")
}

func SetEngine() (*xorm.Engine, error) {
	err := errors.New("")
	if engine, err = ConDb(); err != nil {
		return nil, err
	} else {
		engine.ShowSQL(true)
		engine.ShowExecTime(true)

		// cacher := xorm.NewLRUCacher(xorm.NewMemoryStore(), 10000)
		// engine.SetDefaultCacher(cacher)

		// f, err := os.Create("sql.log")
		// if err != nil {
		// 	println(err.Error())
		// }
		// engine.SetLogger(xorm.NewSimpleLogger(f))

		return engine, err
	}
}

func CreatTables(engine *xorm.Engine) error {
	return engine.Sync2(&Language{}, &Users{}) //Engine.CreateTables(&User{}, &Category{}, &Node{}, &Topic{}, &Reply{})
}

type Language struct {
	Id    int64  `json:""`
	Code  string `xorm:"varchar(50)" json:"Code"`  //標示代碼
	Descr string `xorm:"varchar(50)" json:"Descr"` //字意
	Lang  string `xorm:"varchar(50)"`              //語言
}

//添加語言
func AddLanguage(code, descr, lang string) (int64, error) {
	add := &Language{Code: code, Descr: descr, Lang: lang}

	if _, err := engine.Insert(add); err == nil {
		return add.Id, err
	} else {
		return -1, err
	}
}

func GetByLanguage(code, lang string) (int64, error) {
	lan := &Language{}
	if has, err := engine.Where("code=? and lang=?", code, lang).Get(lan); has {
		return lan.Id, err
	} else {
		return 0, err
	}
}

//获取字母列表
func GetLnaguageList(where string) (*[]Language, error) {
	lan := &[]Language{}
	err := engine.Cols("code", "descr").Where(where).Find(lan)
	return lan, err
}

//用户表
type Users struct {
	Id           int64     `json:"id"`
	Username     string    `xorm:"varchar(50) notnull" json:"username"`
	Password     string    `xorm:"varchar(50) notnull" json:"password"`
	Nickname     string    `xorm:"varchar(50) " json:"nickname"`      //昵称
	Agent        int       `xorm:"default(0)" json:"agent"`           //上级代理的ID，0为普通代理
	Role         int       `xorm:"default(0)" json:"role"`            //用户角色系统管理3、总代理2、代理1、会员0
	Currencycode string    `json:"currencycode"`                      //货币类型 “RMB"
	Balance      float64   `xorm:"default(0)" json:"balance"`         //财务额度
	Credit       float64   `xorm:"default(0)" json:"credit"`          //信用额度
	Nowbalance   float64   `xorm:"default(0)" json:"nowbalance"`      //当前信用额度
	Btccoin      float64   `xorm:"default(0)" json:"btccoin"`         //比特币
	Ethcoin      float64   `xorm:"default(0)" json:"btccoin"`         //比特币
	Ltbcoin      float64   `xorm:"default(0)" json:"btccoin"`         //比特币
	Online       bool      `xorm:"default(false)" json:"online"`      //是否在线
	Loginstatus  bool      `xorm:"default(false)" json:"loginstatus"` //账号状态
	Odds         string    `json:"odds"`                              //赔率盘口
	Status       bool      `xorm:"default(false)" json:"status"`      //是否收单
	Created      time.Time `xorm:"created index" json:"created"`      //添加时间
	Updated      time.Time `xorm:"updated" json:"updated"`            //更新时间
}

//获取用户信息
func GetUserInfo(username string) (*Users, error) {
	var user = &Users{Username: username}
	has, err := engine.Get(user)
	if has {
		return user, err
	} else {
		return nil, err
	}
}

//获取用户列表
func GetUsers(desc string) (*[]Users, error) {
	list := &[]Users{}
	err := engine.Desc(desc).Find(list)
	return list, err
}

//根据角色获取代理
func GetUsersByRole(role int64, offset int, limit int, field string) (*[]Users, error) {
	users := &[]Users{}
	err := engine.Where("role=?", role).Desc(field).Desc("Created").Find(users)
	return users, err
}

//更新密码
func UpUserpass(uid int64, usr *Users) (int64, error) {
	//var user = &Users{Password: password}
	has, err := engine.ID(uid).Cols("password").Update(usr)
	return has, err
}

//通知公告
type Announcement struct {
	Id int64 `json:"id"`
}
