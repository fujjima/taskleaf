import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
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
  const classes = useStyles();

  const onSubmit = (data) => console.log(data);

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
        {/* XXX: 本当はリアルタイムのバリデーションを組みたいが、パフォーマンス的にどうかと思われるためひとまずsubmitボタンを押してから */}
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
                label="ユーザー名"
                inputRef={register({
                  required: '入力が必須です',
                })}
                helperText={errors.name && errors.name.message}
                autoFocus
              />
            </Grid>
            {/* TODO: 無効なメアドに関しては弾く */}
            {/* onSubmitのみ */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                fullWidth
                id="email"
                label="メールアドレス"
                name="email"
                autoComplete="email"
                inputRef={register({
                  required: '入力が必須です',
                })}
                // スタイルを調整する
                helperText={errors.email && errors.email.message}
              />
            </Grid>
            {/* 最低文字数を上回るか */}
            {/* 半角英数字を含むか */}
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="パスワード"
                type="password"
                id="password"
                autoComplete="current-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            // バリデーションエラーがない場合にクリック可とする
            className={classes.submit}
          >
            新規登録
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
