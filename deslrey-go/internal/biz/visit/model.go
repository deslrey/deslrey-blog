package visit

import (
	"time"
)

type VisitLog struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	IP        string    `json:"ip"`
	Location  string    `json:"location"`
	VisitTime time.Time `gorm:"column:visit_time" json:"visitTime"`
	UserAgent string    `gorm:"column:user_agent" json:"userAgent"`
	Referer   string    `json:"referer"`
	Path      string    `json:"path"`
	Device    string    `json:"device"`
}

func (VisitLog) TableName() string {
	return "visit_log"
}

type VisitStats struct {
	TotalVisits int64 `json:"totalVisits"`
}

type VisitLogFilter struct {
	Keyword string     `json:"keyword"`
	Device  string     `json:"device"`
	Start   *time.Time `json:"-"`
	End     *time.Time `json:"-"`
}
