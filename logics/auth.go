package logics

import (
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"

	"../helper"
	"../models"
)

var sessionMgr *helper.SessionMgr = nil
var sessionUser models.Users

//用户登录验证
func Userlogin(username, password string, persistlogin bool, c http.ResponseWriter) (bool, error, string) {
	if info, err := models.GetUserInfo(username); err == nil {
		if info != nil {
			pass_md5 := helper.MD5_16(password)
			if info.Password == pass_md5 {
				cookie := &http.Cookie{
					Name:     "session_id",
					Value:    "123",
					Path:     "/",
					HttpOnly: true,
				}
				http.SetCookie(c, cookie)

				return true, nil, ""
			} else {
				return false, nil, "password error"
			}

		} else {
			return false, nil, "username not exist"
		}

	} else {
		return false, err, ""
	}
}

func Editpassword(c *gin.Context) {

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

}
