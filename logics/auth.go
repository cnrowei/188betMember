package logics

import (
	"net/http"

	"../helper"
	"../models"
)

var sessionMgr *Helper.SessionMgr = nil

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
