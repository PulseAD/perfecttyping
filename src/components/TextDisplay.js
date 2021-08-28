import React from 'react';

class TextDisplay extends React.Component {
  render() {
    let style = {
      fontSize: '2.5vh',
      margin: '0 auto',
      textAlign: 'justify'
    };
    return (
      <div className="text-display" style={style}>
        {this.props.text}
      </div>
    );
  }
}

export default TextDisplay;