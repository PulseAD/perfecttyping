import React from 'react';

class TextInput extends React.Component {
  
  render() {
    let backgroundColor = this.props.isCorrect ? "#CCC9E7" : "rgb(255, 75, 75)";
    let style = {
      width: '100%',
      backgroundColor: backgroundColor,
      marginTop: '3vh',
      color: '#283845',
      fontSize: '2.5vh',
      fontFamily: 'inherit',
      textAlign: 'justify',
      marginBottom: -6
    };
    
    return (
      <textarea onChange={this.props.handleInput} value={this.props.inputValue} style={style} disabled={this.props.isDisable} />
    );
    
  }
}

export default TextInput;