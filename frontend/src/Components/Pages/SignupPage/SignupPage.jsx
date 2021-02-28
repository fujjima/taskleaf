import React, { useContext } from 'react';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { AuthContext } from 'Components/Provider/AuthProvider';
import firebase from 'firebase-config';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper,
  // backgroundColor: theme.palette.secondary.main,
  avatar: theme.avater,
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export const SignupPage = (props) => {
  const { register, handleSubmit, watch, reset, errors, getValues } = useForm();
  const { signup } = useContext(AuthContext);
  const history = useHistory();
  const classes = useStyles();

  // onAuthStateChangedでユーザー状態を取得できる（user.uidとか）

  // TODO: ここで定義するのではなく、firebase関連のメソッドを集めたクラスを作ってここで呼び出すようにしたい
  const onSubmit = (values) => {
    // TODO: firebaseへのサインアップは時間がかかるためloadingを表示させる
    firebase
      .auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(async (res) => {
        // TODO: spinner表示終了のための機構を追加しておく

        // signin()は、railsからの返却値をreduxに入れている
        // ただしサインアップが完了した際に、サインアップしたユーザーに関する情報（名前、メアド、パスワード）あたりはrails側でも保存しておく必要はある
        const token = await res.user.getIdToken(true);

        signup(values, token);
        // railsからのレスポンスが来るまで待たせる
        history.push('/');
      })
      .catch((error) => {
        //異常終了時
        // spinner表示終了のための機構を追加しておく
        alert(error);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          新規登録
        </Typography>
        {/* XXX: 本当はリアルタイムのバリデーションを組みたいが、パフォーマンスの懸念があるためひとまずsubmitボタンを押してからの判定とする */}
        {/* TODO: 入力時のヒントは出す */}
        <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="name"
                name="name"
                variant="outlined"
                fullWidth
                id="name"
                placeholder="藤井悠太"
                label="名前"
                error={errors.name && errors.name.message}
                inputRef={register({
                  required: '名前を入力してください',
                })}
                helperText={errors.name && errors.name.message}
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                placeholder="info@abc.com"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                error={errors.email && errors.email.message}
                inputRef={register({
                  required: 'メールアドレスを入力してください',
                  pattern: {
                    // XXX: メアドを完全に検証することはほぼ不可能なので、気持ち程度に留めておく
                    value: /[\w\-\\._]+@[\w\-\\._]+\.[A-Za-z]+/,
                    message: '有効なメールアドレスを入力してください',
                  },
                })}
                helperText={errors.email && errors.email.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                name="password"
                // TODO: 入力されたパスワードを表示できるようにする
                label="パスワード"
                type="password"
                id="password"
                error={errors.password && errors.password.message}
                helperText="パスワードは6文字以上で入力してください"
                inputRef={register({
                  required: '入力が必須です',
                  minLength: {
                    value: 6,
                    message: '6文字以上入力してください。',
                  },
                })}
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            // TODO: バリデーションエラーがない場合にクリック可としたい
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            新規登録する
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/" variant="body2">
                ログイン画面に戻る
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};
