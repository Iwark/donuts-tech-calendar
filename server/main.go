package main

import (
	"encoding/base64"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path"
	"path/filepath"
	"sync"
	"text/template"

	"github.com/Iwark/trace"
	"github.com/gorilla/pat"
	"github.com/joho/godotenv"
	"github.com/markbates/goth"
	"github.com/markbates/goth/providers/github"
)

type templateHandler struct {
	once     sync.Once
	filename string
	tpl      *template.Template
}

func (t *templateHandler) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	t.once.Do(func() {
		t.tpl = template.Must(template.ParseFiles("templates/application.html", filepath.Join("templates", t.filename)))
	})
	data := map[string]interface{}{
		"Host": r.Host,
	}
	if authCookie, err := r.Cookie("auth"); err == nil {
		name, err := base64.StdEncoding.DecodeString(authCookie.Value)
		if err != nil {
			fmt.Println("error:", err)
			return
		}
		data["Name"] = string(name)
	}
	if err := t.tpl.ExecuteTemplate(w, "application", data); err != nil {
		log.Fatal("TemplateExecute:", err)
	}
}

var (
	env  = flag.String("env", "development", "環境")
	addr = flag.String("addr", ":8080", "アプリケーションのアドレス")
)

func main() {
	flag.Parse()

	// 本番環境実行時はバイナリのあるディレクトリへと移動する
	if *env == "production" {
		dir := path.Dir(os.Args[0])
		os.Chdir(dir)
	}

	err := godotenv.Load(fmt.Sprintf("config/%s.env", *env))
	if err != nil {
		log.Fatal(err)
		return
	}

	goth.UseProviders(
		github.New(os.Getenv("GITHUB_CLIENT_KEY"), os.Getenv("GITHUB_SECRET"), os.Getenv("GITHUB_CALLBACK")),
	)

	p := pat.New()

	r := newRoom()
	r.tracer = trace.New(os.Stdout)
	p.Add("GET", "/public/", http.StripPrefix("/public/", http.FileServer(http.Dir("./public"))))
	p.Add("GET", "/chat", MustAuth(&templateHandler{filename: "chat.html"}))
	p.Add("GET", "/login", &templateHandler{filename: "login.html"})
	p.Add("GET", "/index", &templateHandler{filename: "index.html"})
	p.Get("/auth/{action}/{provider}", loginHandler)
	p.Add("GET", "/room", r)

	// チャットルームの開始
	go r.run()
	// Webサーバの起動
	log.Println("Webサーバーを開始します。ポート: ", *addr)
	if err := http.ListenAndServe(*addr, p); err != nil {
		log.Fatal("ListenAndServe:", err)
	}
}
