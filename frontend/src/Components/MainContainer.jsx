import Axios from 'axios';
import React from 'react';

export default class MainContainer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      products: []
    }
  }

  componentDidMount(){
    axios.get('http://localhost:3000/').then(results => {
      console.log("Here is MainContainer");
      this.setState({ tasks: results.data });
    })
    .catch(data => {
      console.log(data);
    })
  }

  render(){
    return (
      <div className='app-main'></div>
    );
  }
}