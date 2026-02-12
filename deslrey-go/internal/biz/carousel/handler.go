package carousel

import (
	"deslrey-go/internal/config"
	"deslrey-go/pkg/result"
	"math/rand"

	"github.com/gin-gonic/gin"
)

const (
	sexSum     = 2401
	scenerySum = 1600
)

func HandleSexImage(ctx *gin.Context) {
	randomNumber := rand.Intn(sexSum) + 1
	imageUrl := config.Config.Carousel.SexApi + "img" + itoa(randomNumber) + ".webp"
	result.OkData(imageUrl).Send(ctx)
}

func HandleSceneryImage(ctx *gin.Context) {
	randomNumber := rand.Intn(scenerySum) + 1
	imageUrl := config.Config.Carousel.SceneryApi + "img" + itoa(randomNumber) + ".jpg"
	result.OkData(imageUrl).Send(ctx)
}

func itoa(i int) string {
	if i == 0 {
		return "0"
	}
	var b = make([]byte, 0, 20)
	for i > 0 {
		b = append(b, byte(i%10+'0'))
		i /= 10
	}
	for i, j := 0, len(b)-1; i < j; i, j = i+1, j-1 {
		b[i], b[j] = b[j], b[i]
	}
	return string(b)
}
