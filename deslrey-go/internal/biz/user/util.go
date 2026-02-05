package user

import (
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
)

func generateSalt() string {
	b := make([]byte, 16)
	rand.Read(b)
	return hex.EncodeToString(b)
}

func hashPasswordWithSalt(password, salt string) string {
	hash := sha256.New()
	hash.Write([]byte(password + salt))
	return hex.EncodeToString(hash.Sum(nil))
}
