import React from 'react';

// import "./user_box.scss";

class Login extends React.Component {

  render() {
    return (
      <div>
        <div className="page-header">
          <h1>サインインしてください</h1>
        </div>
        <div className="panel panel-danger">
          <div className="panel-heading">
            <h3 className="panel-title">チャットを行うにはサインインが必要です</h3>
          </div>
          <div className="panel-body">
            <p>サインインに使用するサービスを選んでください:</p>
            <ul>
              <li>
                <a href="/auth/login/github">GitHub</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    )
  }
}

export default Login;
