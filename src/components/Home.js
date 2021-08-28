import React from 'react';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state ={
      left: 46.35
    };
    this.onHover = this.onHover.bind(this);
  }

  onHover() {
    let changed = false;
    if (this.state.left < 20) {
      this.setState({
        left: this.state.left + 40
      });
      changed = true;
    }
    if (this.state.left > 80) {
      this.setState({
        left: this.state.left - 40
      });
      changed = true;
    }
    if (!changed) {
      if (Math.random() > .5) {
        this.setState({
          left: this.state.left + 10
        });
      } else {
        this.setState({
          left: this.state.left - 10
        });
      }
    }
  }

  onClick() {
    alert('vous avez cliqué');
  }

  render() {
    const left = this.state.left + "%";
    const style = {
      position: 'absolute',
      left: left
    }
    return (
      <div>
        <h1>Home</h1>
        <button style={style} onMouseOver={this.onHover} onClick={this.onClick}>Cliquer ici</button>
      </div>
    );
  }
}

export default Home;