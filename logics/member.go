package logics

import (
	"fmt"
	"net/http"
	"strconv"
	"time"
	"yougam/helper"

	"../models"

	"github.com/gin-gonic/gin"
)

func AddMember(c *gin.Context) {

	type Users struct {
		Username   string        `json:"username"`
		Password   string        `json:"password"`
		Balance    string        `json:"balance"`
		Memberrole int           `json:"memberrole"`
		Errors     []interface{} `json:"errors"`
	}

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

	var usr Users
	if err := c.BindJSON(&usr); err == nil {

		finfo, err := models.FindUser(usr.Username)

		if err != nil {
			c.JSON(http.StatusOK, gin.H{
				"Status":  1,
				"Message": "查询数据有错误",
				"Params":  nil,
			})
			return
		}

		//fmt.Println(flag)

		if finfo != nil {

			my, err := models.GetUserInfo(sessionUser.Username)

			if err == nil && my != nil {

				uBalance, err := strconv.ParseFloat(usr.Balance, 64)

				if err != nil {
					c.JSON(http.StatusOK, gin.H{
						"Status":  1,
						"Message": "输入的金额错误",
						"Params":  nil,
					})
					return
				}

				if my.Balance < uBalance {
					c.JSON(http.StatusOK, gin.H{
						"Status":  1,
						"Message": "您账号余额不足",
						"Params":  nil,
					})
					return
				}

				uinfo := &models.Users{}
				uinfo.Username = usr.Username
				uinfo.Password = helper.MD5_16(usr.Password)
				uinfo.Balance = uBalance
				uinfo.Agentid = sessionUser.Id
				uinfo.Role = usr.Memberrole
				uinfo.Currency = "RMB"
				uinfo.Credit = 0
				uinfo.Nowbalance = 0
				uinfo.Btccoin = 0
				uinfo.Ethcoin = 0
				uinfo.Ltbcoin = 0
				uinfo.Online = false
				uinfo.Login = true
				uinfo.Odds = "A"
				uinfo.Status = true
				uinfo.Created = time.Now()
				uinfo.Updated = time.Now()

				if uid, err := models.NewUsers(uinfo); err == nil {
					myBalance := my.Balance - uBalance
					err := models.UpUserBalance(sessionUser.Id, myBalance)

					if err != nil {
						c.JSON(http.StatusOK, gin.H{
							"Status":  1,
							"Message": "添加用户扣款失败",
							"Params":  uid,
						})
					} else {
						c.JSON(http.StatusOK, gin.H{
							"Status":  0,
							"Message": "添加用户成功",
							"Params":  uid,
						})
					}

				} else {
					c.JSON(http.StatusOK, gin.H{
						"Status":  1,
						"Message": "添加用户失败",
						"Params":  nil,
					})
				}

			} else {
				c.JSON(http.StatusOK, gin.H{
					"Status":  1,
					"Message": "登录已经超时",
					"Params":  nil,
				})
			}
		} else {

			c.JSON(http.StatusOK, gin.H{
				"Status":  1,
				"Message": "该用户名已经存在",
				"Params":  nil,
			})
		}
	} else {
		c.JSON(http.StatusOK, gin.H{
			"Status":  1,
			"Message": "提交JSON数据有错误",
			"Params":  nil,
		})
	}

	//{"Status":0,"Message":"个人资料成功更新","Params":null}

}
