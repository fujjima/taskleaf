import { createMuiTheme } from '@material-ui/core/styles';
import { purple } from '@material-ui/core/colors';

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
