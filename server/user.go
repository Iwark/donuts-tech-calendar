package main

import (
	"fmt"

	"gopkg.in/mgo.v2"
	"gopkg.in/mgo.v2/bson"
)

// Userはgithubから取得したユーザー情報を格納する構造体
type User struct {
	// URL はgithubのURL
	URL string `mapstructure:"html_url"`
	// UserName はgithub上でのユーザーネーム
	UserName string `mapstructure:"login" bson:"user_name"`
	// Name はgithub上での名前
	Name string `mapstructure:"name"`
	// PublicRepos は公開リポジトリの数
	PublicRepos int `mapstructure:"public_repos" bson:"public_repos"`
	// Following はフォロー数
	Following int `mapstructure:"following"`
	// Followers はフォロワーの数
	Followers int `mapstructure:"followers"`
	// AvatarURL はアバターのURL
	AvatarURL string `mapstructure:"avatar_url" bson:"avatar_url"`
}

func (u *User) FindOrCreate(c *mgo.Collection) error {

	existsUser := User{}
	err := c.Find(bson.M{"user_name": u.UserName}).One(&existsUser)
	if err == nil {
		fmt.Printf("Found a user: %#v \n", existsUser)
		// Found a user
		return nil
	}
	fmt.Printf("--- %#v \n", u)
	err = c.Insert(u)
	if err != nil {
		return err
	}
	return nil
}
