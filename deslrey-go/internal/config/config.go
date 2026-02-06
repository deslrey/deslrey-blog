package config

import (
	"flag"
	"log"
	"os"

	"gopkg.in/yaml.v3"
)

type ConfigType struct {
	Debug bool `yaml:"debug"`

	DomainName string `yaml:"domainName"`
	Port       int    `yaml:"port"`

	JwtSigningKey string `yaml:"jwtSigningKey"`

	Custom struct {
		StaticSourcePath string `yaml:"staticSourcePath"`
		StaticUrl        string `yaml:"staticUrl"`
		URL              string `yaml:"url"`
	} `yaml:"custom"`

	Carousel struct {
		SexApi     string `yaml:"sexApi"`
		SceneryApi string `yaml:"sceneryApi"`
	} `yaml:"carousel"`

	PostgreSQL struct {
		Host string `yaml:"host"`
		Port int    `yaml:"port"`

		User     string `yaml:"user"`
		Password string `yaml:"password"`
		DBName   string `yaml:"dbName"`
	} `yaml:"postgresql"`
	Redis struct {
		Host string `yaml:"host"`
		Port int    `yaml:"port"`

		User     string `yaml:"user"`
		Password string `yaml:"password"`
		DBName   int    `yaml:"dbName"`

		Size int `yaml:"size"`
	} `yaml:"redis"`
}

var Config ConfigType

func Init() {
	err := InitConfig()
	if err != nil {
		log.Fatal(err)
	}
}

func parseFlags() (string, error) {
	var configPath string
	flag.StringVar(&configPath, "configs", "./configs.yaml", "Path to configs path")

	flag.Parse()

	return configPath, nil
}

func InitConfig() error {
	configPath, err := parseFlags()
	if err != nil {
		log.Fatal(err)
	}

	data, err := os.ReadFile(configPath)
	if err != nil {
		return err
	}

	if err := yaml.Unmarshal(data, &Config); err != nil {
		return err
	}

	return nil
}
