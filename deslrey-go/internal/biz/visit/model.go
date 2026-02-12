package visit

import (
	"time"
)

type VisitLog struct {
	ID        int       `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	IP        string    `gorm:"column:ip;type:varchar(50)" json:"ip"`
	Location  string    `gorm:"column:location;type:varchar(100)" json:"location"`
	UserAgent string    `gorm:"column:user_agent;type:varchar(255)" json:"user_agent"`
	Referer   string    `gorm:"column:referer;type:varchar(255)" json:"referer"`
	Path      string    `gorm:"column:path;type:varchar(255)" json:"path"`
	VisitTime time.Time `gorm:"column:visit_time;not null;default:now()" json:"visit_time"`
	Device    string    `gorm:"column:device;type:varchar(50)" json:"device"`
}

func (VisitLog) TableName() string {
	return "visit_log"
}

type VisitStats struct {
	TotalVisits int64 `json:"totalVisits"`
}
