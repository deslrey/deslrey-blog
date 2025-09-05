package model

import "time"

// Article 文章
type Article struct {
	ID         uint32    `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	Title      string    `gorm:"column:title;type:varchar(255)" json:"title"`
	Content    string    `gorm:"column:content;type:text" json:"content"`
	WordCount  int       `gorm:"column:word_count" json:"word_count"`
	Views      int       `gorm:"column:views" json:"views"`
	CreateTime time.Time `gorm:"column:create_time" json:"create_time"`
	UpdateTime time.Time `gorm:"column:update_time" json:"update_time"`
	Category   string    `gorm:"column:category;type:varchar(255)" json:"category"`
	Des        string    `gorm:"column:des;type:varchar(255)" json:"des"`
	Sticky     bool      `gorm:"column:sticky" json:"sticky"`
	Edit       bool      `gorm:"column:edit" json:"edit"`
	Exist      bool      `gorm:"column:exist" json:"exist"`
}

func (Article) TableName() string {
	return "article"
}

// UserInfo	用户
type UserInfo struct {
	ID         uint32     `gorm:"column:id;primaryKey;autoIncrement" json:"id"`
	UserName   string     `gorm:"column:user_name;type:varchar(255);not null" json:"user_name"`
	PassWord   string     `gorm:"column:pass_word;type:varchar(255);not null" json:"-"`
	Email      string     `gorm:"column:email;type:varchar(255)" json:"email"`
	CreateTime *time.Time `gorm:"column:create_time" json:"create_time"`
	UpdateTime *time.Time `gorm:"column:update_time" json:"update_time"`
	Exist      bool       `gorm:"column:exist" json:"exist"`
}

func (UserInfo) TableName() string {
	return "user_info"
}
