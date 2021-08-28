import React from 'react';
import MainView from './MainView';
import FetchTextService from './FetchTextService';
import ScoreStorage from './ScoreStorage';

class SoloTyping extends React.Component {

  fetchTextService = new FetchTextService();
  scoreStorage = new ScoreStorage();

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      inputValue: '',
      displayedText: '',
      isCorrect: true,
      isHardcore: false,
      startingTimestamp: 0,
      hasFinished: false,
      mpm: null,
      completeTextObj: {},
      scores: []
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleDisplayedText = this.handleDisplayedText.bind(this);
    this.checkValidity = this.checkValidity.bind(this);
    this.handleReset = this.handleReset.bind(this);
    this.modeSwap = this.modeSwap.bind(this);
    this.checkFinish = this.checkFinish.bind(this);
    this.reset = this.reset.bind(this);
    this.initText = this.initText.bind(this);
    this.resetScores = this.resetScores.bind(this);
    this.initText();
  }

  handleInput(event) {
    if(this.state.startingTimestamp === 0) {
      this.setState({
        startingTimestamp: Date.now()
      });
    }
    this.handleDisplayedText(event.target.value);
    this.manageGameState(event.target.value);
    this.checkFinish(event.target.value);
    
  }

  manageGameState(input) {
    let isCorrect = this.checkValidity(input);

    if (isCorrect) {
      this.setState({
        isCorrect: true
      });
      this.setState({
        inputValue: input
      });
    } else {
      this.setState({
        isCorrect: false
      });
      if (this.state.isHardcore) {
        this.handleReset(input);
      } else {
        this.setState({
          inputValue: input
        });
      }
    }

  }

  checkFinish(value) {
    if (value === this.state.text) {
      
      let totalChar = this.state.text.length;
      let durationInMs = Date.now() - this.state.startingTimestamp;
      let durationInSecond = (durationInMs / 1000);
      let ratio = durationInSecond / 60;
      let wpm = Math.round(totalChar / ratio / 5);
      this.setState({ 
        hasFinished: true,
        mpm: wpm
      });
      this.scoreStorage.saveScore(this.state.completeTextObj.uuid, wpm, this.state.isHardcore);
      this.setScores();
    }
  }

  handleDisplayedText(value) {
    let goodText = this.obtainGoodInputText(value);

    let initialTextArray = this.textToArray(this.state.text);
    let goodTextArray = this.textToArray(goodText);
    
    let actualWordIndice = this.obtainCurrentIndice(goodTextArray, initialTextArray);

    let initialTextJsxArray = this.transformWordArrayToJsx(initialTextArray, actualWordIndice);
    this.setState({
      displayedText: initialTextJsxArray
    });
  }
  
  obtainGoodInputText(value) {
    let goodText = "";
    for (let i = 0; i < value.length; ++i) {
      if (value[i] === this.state.text[i]) {
        goodText += value[i];
      } else {
        break;
      }
    }
    return goodText;
  }

  textToArray(text) {
    let array = text.split(" ");
    array = this.addWhitespacesToWordArray(array);
    return array;
  }

  addWhitespacesToWordArray(array) {
    for (let i = 0 ; i < array.length ; i+=2) {
      if (i !== array.length - 1) {
        array.splice(i + 1, 0, " ");
      }
      
    }
    return array;
  }

  obtainCurrentIndice(inputArray, fullArray) {
    let actualWordIndice = 0;
    for (let i = 0; i < inputArray.length; ++i) {
      if (fullArray[i] === inputArray[i]) {
        actualWordIndice++;
      }
    }
    return actualWordIndice;
  }

  transformWordArrayToJsx(fullArray, indice) {
    for (let i = 0; i < fullArray.length; ++i) {
      if (i === indice) {
        fullArray[i] = <span className="actual" key={i}>{fullArray[i]}</span>;
      } else if (i < indice) {
        fullArray[i] = <span className="good" key={i}>{fullArray[i]}</span>;
      } else {
        fullArray[i] = <span className="todo" key={i}>{fullArray[i]}</span>;
      }
    }
    return fullArray;
  }

  checkValidity(answer) {
    let correctValue = this.state.text.slice(0, answer.length);
    return (answer === correctValue);
  }

  handleReset(wrongValue) {
    const lastWords = wrongValue.slice(-10);
    alert("Tu as tapé: \"" + lastWords + "\"");
    this.reset();
  }

  reset() {
    this.setState({
      inputValue: '',
      startingTimestamp: 0,
      hasFinished: false,
      displayedText: this.state.text,
      isCorrect: true,
      mpm: null
    })
  }

  resetScores() {
    const shouldDelete = window.confirm("Ceci supprimera tous les scores pour tous les textes et tous les modes, êtes-vous sûr ?");
    if (!shouldDelete) {
      return;
    }
    this.scoreStorage.resetAllScores();
    this.setScores();
  }

  modeSwap() {
    this.reset();
    this.setState({
      isHardcore: !this.state.isHardcore
    }, () => {
      this.setScores();
    });

  }

  fetchTextSymfony() {
    fetch('http://typebetter.local/text/random')
    .then(response => {
      return response.json();
    })
    .then(response => {
      this.setState({
        text: response.text,
        displayedText: response.text
      });
      this.reset();
    })
    .catch(error => {
      console.log(error);
    });
  }

  async initText(fromStorage = false) {
    let text, content;
    if (fromStorage) {
      this.reset();
      text = await this.fetchTextService.getRandomLocalText(this.state.text);
    } else {
      text = await this.fetchTextService.getText();
    }
    content = text.content.content;
    this.setState({
      completeTextObj: text,
      text: content,
      displayedText: content
    }, () => {
      this.setScores();
    });
  }

  setScores() {
    const isHardcore = this.state.isHardcore;
    const uuid = this.state.completeTextObj.uuid;
    const scores = this.scoreStorage.obtainScores(uuid, isHardcore);
    this.setState({
      scores: scores
    });
  }

  render() {
    const data = {
      displayedText: this.state.displayedText,
      inputValue: this.state.inputValue,
      mode: this.state.isHardcore ? "Hardcore" : "Normal",
      handleInput: this.handleInput,
      isCorrect: this.state.isCorrect,
      hasFinished: this.state.hasFinished,
      mpm: this.state.mpm,
      modeSwap: this.modeSwap,
      reset: this.reset,
      initText: this.initText,
      scores: this.state.scores,
      resetScores: this.resetScores
    }


    return <MainView data={data}></MainView>;
  }
}

export default SoloTyping;