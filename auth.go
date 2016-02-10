package main

import (
	"encoding/base64"
	"fmt"
	"log"
	"net/http"

	"github.com/markbates/goth/gothic"
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
	provider := r.URL.Query().Get(":provider")

	switch action {
	case "login":
		gothic.BeginAuthHandler(w, r)
		log.Println("TODO: ログイン処理", provider)
	case "callback":
		// print our state string to the console. Ideally, you should verify
		// that it's the same string as the one you set in `setState`
		fmt.Println("State: ", gothic.GetState(r))

		user, err := gothic.CompleteUserAuth(w, r)
		if err != nil {
			log.Fatal("CompleteUserAuth error: ", err)
			return
		}

		authCookieValue := base64.StdEncoding.EncodeToString([]byte(user.Name))
		http.SetCookie(w, &http.Cookie{
			Name:  "auth",
			Value: authCookieValue,
			Path:  "/",
		})
		fmt.Println(user)
		w.Header().Set("Location", "/index#/chat")
		w.WriteHeader(http.StatusTemporaryRedirect)
	default:
		w.WriteHeader(http.StatusNotFound)
		fmt.Fprintf(w, "アクション%sには非対応です", action)
	}
}
