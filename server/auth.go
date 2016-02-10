package main

import (
	"encoding/base64"
	"fmt"
	"log"
	"net/http"

	"gopkg.in/mgo.v2"

	"github.com/markbates/goth/gothic"
	"github.com/mitchellh/mapstructure"
)

type authHandler struct {
	next http.Handler
}

func (h *authHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	if _, err := r.Cookie("auth"); err == http.ErrNoCookie {
		// 未認証
		w.Header().Set("Location", "/login")
		w.WriteHeader(http.StatusTemporaryRedirect)
	} else if err != nil {
		// 何らかの別のエラーが発生
		panic(err.Error())
	} else {
		// 成功。ラップされたハンドラを呼び出す
		h.next.ServeHTTP(w, r)
	}
}

func MustAuth(handler http.Handler) http.Handler {
	return &authHandler{next: handler}
}

// loginHandlerはサードパーティへのログインの処理を受け持ちます
// パスの形式: /auth/{action}/{provider}
func loginHandler(w http.ResponseWriter, r *http.Request) {
	action := r.URL.Query().Get(":action")
	// provider := r.URL.Query().Get(":provider")

	switch action {
	case "login":
		gothic.BeginAuthHandler(w, r)
	case "callback":
		// print our state string to the console. Ideally, you should verify
		// that it's the same string as the one you set in `setState`
		fmt.Println("State: ", gothic.GetState(r))

		githubUser, err := gothic.CompleteUserAuth(w, r)
		if err != nil {
			log.Fatal("CompleteUserAuth error: ", err)
			return
		}

		// ユーザーの保存
		var user User
		err = mapstructure.Decode(githubUser.RawData, &user)
		if err != nil {
			log.Fatal("mapstructure error: ", err)
			return
		}

		session, err := mgo.Dial("mongodb://localhost")
		if err != nil {
			log.Fatal("mgo database dial error:", err)
			return
		}
		defer session.Close()

		session.SetMode(mgo.Monotonic, true)
		c := session.DB("donuts_tech_calendar").C("users")
		err = user.FindOrCreate(c)
		if err != nil {
			log.Fatal("user.FindOrCreate error:", err)
			return
		}

		authCookieValue := base64.StdEncoding.EncodeToString([]byte(user.UserName))
		http.SetCookie(w, &http.Cookie{
			Name:  "auth",
			Value: authCookieValue,
			Path:  "/",
		})

		w.Header().Set("Location", "/chat")
		w.WriteHeader(http.StatusTemporaryRedirect)
	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "アクション%sには非対応です", action)
	}
}
