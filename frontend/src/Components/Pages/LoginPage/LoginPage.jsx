// TODO:この辺のimportはどのファイルにもあるので、まとめてimportできないか
import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { AuthContext } from 'Components/Provider/AuthProvider';

// クラスコンポーネント内でhookは呼び出せないため、高階コンポーネントを使用する
// https://material-ui.com/styles/basics/#higher-order-component-api
const sytles = (theme) => ({
  container: {},
  paper: theme.paper,
  avater: theme.avater,
  form: {
    width: '100 %',
    marginTop: '12px',
  },
  submit: {
    margin: '36px 0 24px',
  },
});

// react hooksを使用している場合
// const useSytles = makeStyles((theme) => ({
//   container: {},
//   paper: {
//     marginTop: theme.spacing(2),
//     display: 'flex',
//   },
// }));

class LoginPage extends React.Component {
  static contextType = AuthContext;

  static propTypes = {
    classes: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      name: '',
      password: null,
    };
  }

  // handler

  handleClick = (e) => {
    const { login } = this.context;
    const { email, password } = this.state;
    login({ email: email, password: password });
    e.preventDefault();
  };

  render() {
    const { classes } = this.props;
    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avater}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            ログイン
          </Typography>
          {/* TODO: メアドのバリデーション入れたい（他サービスの使用例を見る） */}
          <form className={classes.form} noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="メールアドレス"
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
              label="パスワード"
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
              onClick={(e) => this.handleClick(e)}
            >
              ログイン
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  パスワードを忘れた場合
                </Link>
              </Grid>
              <Grid item>
                <Link component={RouterLink} to="/signup" variant="body2">
                  新規登録の場合
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  }
}

// TODO: withStylesの使い方について
export default withStyles(sytles)(LoginPage);
