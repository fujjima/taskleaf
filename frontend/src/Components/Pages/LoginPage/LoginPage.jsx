// TODO:この辺のimportはどのファイルにもあるので、まとめてimportできないか
import React from 'react';
import { withStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';

// TODO: Material UIの場合、各種ページに対してCSSを適用させることはできるか調査したい

// CSS in JSの書き方を採用している
// クラスコンポーネント内でhookは呼び出せないため、高階コンポーネントを使用する
// https://material-ui.com/styles/basics/#higher-order-component-api
const sytles = (theme) => ({
  top: {
    font: 'red',
    fontSize: '30px',
  },
});

class LoginPage extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.top}>
        <p>こんにちは</p>
      </div>
    );
  }
}

// propの型チェック
LoginPage.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(sytles)(LoginPage);
