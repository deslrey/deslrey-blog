package tag

type Tag struct {
	ID    int    `gorm:"primaryKey" json:"id"`
	Title string `json:"title"`
}

func (Tag) TableName() string {
	return "tag"
}

type TitleCount struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Count int    `json:"count"`
}

type ArticleListItem struct {
	ID         int      `json:"id"`
	Title      string   `json:"title"`
	Des        string   `json:"des"`
	Category   string   `json:"category"`
	Tags       []string `json:"tags"`
	Sticky     bool     `json:"sticky"`
	Edit       bool     `json:"edit"`
	CreateTime any      `json:"createTime"`
	UpdateTime any      `json:"updateTime"`
}
