package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"strings"

	"./helper"
	"./logics"
	"./models"
	"github.com/gin-gonic/gin"
)

//"fmt"
//"github.com/gin-gonic/gin/binding"

var sessionMgr *helper.SessionMgr = nil
var sessionUser models.Users

//添加中间件
func Middleware(c *gin.Context) {
	var sessionID = sessionMgr.CheckCookieValid(c.Writer, c.Request)
	if sessionID != "" {
		//http.Redirect(c.Writer, c.Request, "/#!/Login", http.StatusFound)
		if userInfo, ok := sessionMgr.GetSessionVal(sessionID, "UserInfo"); ok {

			sessionUser = userInfo.(models.Users)

			// if value, ok := userInfo.(models.Users); ok {
			fmt.Println("sessionUser.Username", sessionUser.Username)
			// }
		}
	}
}

func main() {

	sessionMgr = helper.NewSessionMgr("188betCookie", 3600)

	gin.SetMode(gin.DebugMode)

	router := gin.Default()
	router.Delims("{[{", "}]}")
	router.Static("/Content", "./Content")
	router.Static("/Views", "./Views")

	router.Static("/signalrnet", "./signalrnet")
	router.Static("/cdn1101", "./cdn1101")
	//router.LoadHTMLFiles("Templates/*")
	//router.SetHTMLTemplate()
	router.LoadHTMLGlob("Templates/*")
	//router.LoadHTMLGlob("templates/myaccount/*")
	//router.LoadHTMLFiles("Views/default.tpl.html", "Views/dashboard.tpl.html")

	//添加中间件
	router.Use(Middleware)

	router.GET("/", func(c *gin.Context) {
		c.HTML(http.StatusOK, "default.tpl.html", gin.H{
			"title": "首页",
		})
	})

	router.GET("/default.htm", func(c *gin.Context) {
		c.HTML(http.StatusOK, "default.tpl.html", gin.H{
			"title": "首页",
		})
	})

	router.GET("/188/Member/", func(c *gin.Context) {
		var sessionID = sessionMgr.CheckCookieValid(c.Writer, c.Request)
		if sessionID == "" {
			http.Redirect(c.Writer, c.Request, "/#!/Login", http.StatusFound)
		} else {
			c.HTML(http.StatusOK, "dashboard.tpl.html", gin.H{
				"title": "摘要",
			})
		}
	})

	router.GET("/Api/Web/Validator", func(c *gin.Context) {
		data := readFile1("Content/json/Validator.json")
		c.Writer.WriteString(data)
	})

	router.GET("/Api/Web/RedirectTo188MemberSite", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"Status":  0,
			"Message": "https://www.mylucky.net/",
			"Params":  nil,
		})
	})

	router.GET("/Api/Dashboard/CheckProfile", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"Status":  0,
			"Message": nil,
			"Params":  nil,
		})
	})
	//

	router.POST("/Api/Member/Add", logics.AddMember)

	//公告
	router.POST("/Api/Web/Message", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"Name":             "luo",
			"Content":          nil,
			"PreferedLanguage": "zh-CN",
			"Status":           0,
			"Message":          nil,
			"Params":           nil,
		})
	})

	//语言设置
	router.POST("/Api/Web/Label", func(c *gin.Context) {
		var lab Label
		if err := c.ShouldBindJSON(&lab); err == nil {
			keys := strings.Split(lab.Keys, ",")
			where := bytes.Buffer{}
			for i, v := range keys {
				where.WriteString(" code=")
				where.WriteString("'" + v + "'")
				if i < (len(keys) - 1) {
					where.WriteString(" or")
				} else {
					where.WriteString(" ")
				}
			}

			if lans, err := models.GetLnaguageList(where.String()); lans != nil && err == nil {
				c.JSON(http.StatusOK, *lans)
			}

		} else {
			c.JSON(http.StatusOK, gin.H{
				"Message": err.Error(),
				"Params":  nil,
				"Status":  1,
			})
		}
	})

	//登录
	router.POST("/Api/Web/Login", func(c *gin.Context) {
		var login Loginuser
		if err := c.ShouldBindJSON(&login); err == nil {

			if info, err := models.GetUserInfo(login.Username); info != nil && err == nil {
				pass_md5 := helper.MD5_16(login.Password)

				if info.Password == pass_md5 {

					var sessionID = sessionMgr.StartSession(c.Writer, c.Request)
					var loginUserInfo = models.Users{Id: info.Id, Username: info.Username}

					//踢除重复登录的
					var onlineSessionIDList = sessionMgr.GetSessionIDList()

					for _, onlineSessionID := range onlineSessionIDList {
						if userInfo, ok := sessionMgr.GetSessionVal(onlineSessionID, "UserInfo"); ok {
							if value, ok := userInfo.(models.Users); ok {
								if value.Id == info.Id {
									sessionMgr.EndSessionBy(onlineSessionID)
								}
							}
						}
					}

					//设置变量值
					sessionMgr.SetSessionVal(sessionID, "UserInfo", loginUserInfo)

					c.JSON(http.StatusOK, gin.H{"Status": 0,
						"Message": nil,
						"Params": gin.H{
							"CultureCode": "zh-CN",
						},
					})

				} else {
					c.JSON(http.StatusOK, gin.H{"Status": 1,
						"Message": "The username or password provided is incorrect!",
						"Params":  nil})
				}

			} else {
				c.JSON(http.StatusOK, gin.H{"Status": 1,
					"Message": "The username is notnull!",
					"Params":  nil})
			}

		} else {
			c.JSON(http.StatusOK, gin.H{"Status": 1,
				"Message": "The Bind json error!",
				"Params":  nil})
		}
	})

	//更新密码
	router.POST("/Api/Account/Password", func(c *gin.Context) {
		type JsonHolder struct {
			Confirm string `form:"confirm" json:"confirm" binding:"required"`
			Current string `form:"current" json:"current" binding:"required"`
			Newpass string `form:"newpass" json:"newpass" binding:"required"`
		}

		var info JsonHolder

		if err := c.ShouldBindJSON(&info); err == nil {

			if user, err := models.GetUserInfo(sessionUser.Username); user != nil && err == nil {

				pass_md5 := helper.MD5_16(info.Current)
				fmt.Println("pass info.Current:", info.Current)
				fmt.Println("user pass:", user.Password)
				fmt.Println("Current pass:", pass_md5)

				if user.Password == pass_md5 {
					newpass_md5 := helper.MD5_16(info.Newpass)
					user.Password = newpass_md5
					if has, err := models.UpUserpass(sessionUser.Id, user); has > 0 && err == nil {
						c.JSON(http.StatusOK, gin.H{"Status": 1, "Message": "密码修改成功", "Params": nil})
					} else {
						c.JSON(http.StatusOK, gin.H{"Status": 1, "Message": "密码修改失败", "Params": nil})
					}
				} else {
					c.JSON(http.StatusOK, gin.H{"Status": 1, "Message": "当前密码错误", "Params": nil})
				}
			} else {
				c.JSON(http.StatusOK, gin.H{"Status": 1, "Message": "获取用户信息失败", "Params": nil})
			}
		} else {
			c.JSON(http.StatusOK, gin.H{"Status": 1, "Message": "数据出错，请从新尝试", "Params": nil})
		}
		// data := readFile1("Content/json/MonthList.json")
		// c.Request.Header.Set("Content-Type", "application/json;charset=UTF-8")
		// c.Writer.WriteString(data)
	})

	router.GET("/Api/Report/MonthList", func(c *gin.Context) {
		data := readFile1("Content/json/MonthList.json")
		c.Request.Header.Set("Content-Type", "application/json;charset=UTF-8")
		c.Writer.WriteString(data)
	})

	router.POST("/Api/Report/WinLossProduct", func(c *gin.Context) {
		data := readFile1("Content/json/WinLossProduct.json")
		c.Writer.WriteString(data)
	})

	//会员列表
	router.GET("/Api/Report/MemberList", func(c *gin.Context) {

		if list, err := models.GetUsers("created"); list != nil && err == nil {
			c.JSON(http.StatusOK, *list)
		} else {
			fmt.Println(err.Error())
		}
		// data := readFile1("Content/json/MemberList.json")
		// c.Request.Header.Set("Content-Type", "application/json;charset=UTF-8")
		// c.Writer.WriteString(data)
	})

	router.GET("/Api/Marketing/Link", func(c *gin.Context) {
		data := readFile1("Content/json/Link.json")
		c.Request.Header.Set("Content-Type", "application/json;charset=UTF-8")
		c.Writer.WriteString(data)
	})

	router.GET("/Api/Web/SecurityQuestions", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/SecurityQuestions.json")
		c.Writer.WriteString(xxxjson)
	})

	router.GET("/Api/Web/DialCode", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/DialCode.json")
		c.Writer.WriteString(xxxjson)
	})

	router.GET("/Api/Web/ChatTools", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/ChatTools.json")
		c.Writer.WriteString(xxxjson)
	})

	router.GET("/Api/Web/Country/1", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/Country.json")
		c.Writer.WriteString(xxxjson)
	})

	router.GET("/Api/Web/CountryContact/1", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/CountryContact.json")
		c.Writer.WriteString(xxxjson)
	})

	router.GET("/Api/Web/Currency/1", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/Currency.json")
		c.Writer.WriteString(xxxjson)
	})

	router.GET("/Api/Web/Language/1", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/Language.json")
		c.Writer.WriteString(xxxjson)
	})

	router.POST("/Api/Web/PublicMessage", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{
			"Name":             nil,
			"Content":          nil,
			"PreferedLanguage": nil,
			"Status":           0,
			"Message":          nil,
			"Params":           nil,
		})
	})

	router.GET("/Api/Web/IsSessionExpired", func(c *gin.Context) {

		var sessionID = sessionMgr.CheckCookieValid(c.Writer, c.Request)
		if sessionID == "" {
			c.JSON(http.StatusOK, gin.H{"Status": 0, "Message": nil, "Params": nil})
		} else {
			c.JSON(http.StatusOK, gin.H{"Status": 1, "Message": nil, "Params": nil})
		}

	})

	router.GET("/Api/Dashboard/Info", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/Info.json")
		c.Writer.WriteString(xxxjson)
	})

	router.GET("/LocaleHandler", func(c *gin.Context) {
		//lang := c.Param("lang")
		cookie1 := http.Cookie{Name: "Language", Value: "zh-CN", Path: "/", MaxAge: 86400}
		cookie2 := http.Cookie{Name: "prefer", Value: "zh-CN", Path: "/", MaxAge: 86400}
		//cookie =
		http.SetCookie(c.Writer, &cookie1)
		http.SetCookie(c.Writer, &cookie2)
	})

	router.GET("/Api/Label", func(c *gin.Context) {
		var xxxjson string
		xxxjson = readFile1("Content/json/Label.json")
		postLabel("Content/json/Label.json")

		c.Writer.WriteString(xxxjson)
	})

	router.Run(":8088")

}

type Label struct {
	Keys string `form:"keys" json:"keys" binding:"required"`
}

type Loginuser struct {
	Username string `form:"username" json:"username" binding:"required"`
	Password string `form:"password" json:"password" binding:"required"`
	Captcha  string `form:"captcha" json:"captcha"`
}

func readFile1(path string) string {
	fi, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer fi.Close()
	fd, err := ioutil.ReadAll(fi)
	return string(fd)
}

func postLabel(path string) {
	var lan []models.Languages

	fi, err := os.Open(path)
	if err != nil {
		println(err.Error())
	}
	defer fi.Close()
	fd, err := ioutil.ReadAll(fi)

	err = json.Unmarshal(fd, &lan)
	if err != nil {
		println(err.Error())
	} else {
		//models.AddLanguage(lan)
		//affected, err = models.engine.Insert(&lan)
		var id int64

		for _, ok := range lan {

			lan, err := models.GetByLanguage(ok.Code, "zh-CN")
			if lan == 0 {
				if id, err = models.AddLanguage(ok.Code, ok.Descr, "zh-CN"); err != nil {
					println(err.Error())
					println(ok.Code)
				} else {
					println(id, ok.Code)
				}
			}
		}

	}

}
