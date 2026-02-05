package util

import (
	"deslrey-go/pkg/logger"

	"github.com/jaevor/go-nanoid"
)

func Issuer() *string {
	generator, err := nanoid.Standard(21)
	if err != nil {
		logger.Logger.Fatal(err)
	}
	s := generator()
	return &s
}

func GenerateSalt() string {
	generator, err := nanoid.Standard(16)
	if err != nil {
		logger.Logger.Fatal(err)
	}
	return generator()
}

func GenerateDigit() string {
	generator, err := nanoid.CustomASCII("0123456789", 6)
	if err != nil {
		logger.Logger.Fatal(err)
	}
	return generator()
}
