// TODO:この辺のimportはどのファイルにもあるので、まとめてimportできないか
import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import {
  Avatar,
  Container,
  CssBaseline,
  makeStyles,
  Typography,
  TextField,
  FormControlLabel,
  Checkbox,
  Button,
  Grid,
  Link,
} from '@material-ui/core';
import { purple } from '@material-ui/core/colors';
import { connect } from '../../../Lib/Connect';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

// TODO: Material UIの場合、各種ページに対してCSSを適用させることはできるか調査

// クラスコンポーネント内でhookは呼び出せないため、高階コンポーネントを使用する
// https://material-ui.com/styles/basics/#higher-order-component-api
const sytles = {
  container: {},
  paper: {
    marginTop: '100px',
    // 子要素を縦に並べる ----------
    display: 'flex',
    flexDirection: 'column',
    // --------------------------
    alignItems: 'center',
  },
  avater: {
    margin: '12px',
    // TODO: hooksを使用してmaterial ui標準のpaletteを使いたい
    backgroundColor: purple[400],
  },
  form: {
    width: '100 %',
    marginTop: '12px',
  },
  submit: {
    margin: '36px 0 24px',
  },
};

// react hooksを使用している場合
// const useSytles = makeStyles((theme) => ({
//   container: {},
//   paper: {
//     marginTop: theme.spacing(2),
//     display: 'flex',
//   },
// }));

class LoginPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: null,
    };
  }

  // handler

  handleClick = () => {
    const { email, password } = this.state;
    const test = connect.login({ email: email, password: password });
  };

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        {/* ブラウザによる表示の差異を解消、ページのマージン消滅、背景色の変更 */}
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avater}>
            <LockOutlinedIcon />
          </Avatar>
          {/* variant:文字サイズ component:<h1></h1>で出力 */}
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {/* TODO: メアドのバリデーション入れたい（他サービスの使用例を見る） */}
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              onChange={(e) => {
                this.setState({ email: e.target.value });
              }}
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              onChange={(e) => {
                this.setState({ password: e.target.value });
              }}
              autoComplete="current-password"
            />
            {/* 個々のフォームのラベルを管理する（radio,checkbox,swhitch） */}
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="ログイン時に記憶する"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={this.handleClick}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  パスワードを忘れた場合
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {'新規登録の場合'}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

// propの型チェック
LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(sytles)(LoginPage);
