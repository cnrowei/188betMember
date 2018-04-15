package models

import (
	//"fmt"
	"sync"
	"time"

	"github.com/go-xorm/xorm"
)

var (
	cache        = make([]interface{}, 0)
	mutex        sync.RWMutex
	isTimeout    bool
	maxCacheSize = 100
	firstTime    time.Time
	timeOut      = 20 * time.Second
)

func CacheInsert(orm *xorm.Engine, beans ...interface{}) (int64, error) {
	mutex.Lock()
	defer mutex.Unlock()
	if len(cache) == 0 {
		firstTime = time.Now()
		isTimeout = false
	} else {
		isTimeout = time.Now().Sub(firstTime) > timeOut
	}

	cache = append(cache, beans...)
	if len(cache) >= maxCacheSize || isTimeout {
		affected, err := orm.Insert(&cache)
		cache = make([]interface{}, 0)
		return affected, err
	}
	return 0, nil
}
