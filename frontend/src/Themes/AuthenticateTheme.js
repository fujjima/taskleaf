import { createMuiTheme } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

// ログイン、サインイン周りで使用される共通テーマ
export const AuthenticateTheme = createMuiTheme({
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
});
