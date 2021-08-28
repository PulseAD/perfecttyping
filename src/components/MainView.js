import React from 'react';
import TextDisplay from './TextDisplay';
import TextInput from './TextInput';
import './SoloTyping.css';

class MainView extends React.Component {
    constructor(props) {
        super(props);
    }

    formatDate(d) {
        const date = new Date(d);
        const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
        return date.toLocaleDateString("fr-FR", options);
    }

    render() {
        const v = this.props.data;
        const scores = v.scores.map((score, i) => {
            return (<tr key={i}>
                 <td>#{i+1}</td>
                 <td>{score.wpm}</td>
                 <td>{this.formatDate(score.date)}</td>
                 </tr>);
            });
        const noScores = (<tr><td colspan="3">Tapez le texte pour obtenir votre premier score</td></tr>);
        
        
        return <div className="solotyping-container">
            <div className="text-container">
                <TextDisplay text={v.displayedText} />
                <TextInput handleInput={v.handleInput} inputValue={v.inputValue} isCorrect={v.isCorrect} isDisable={v.hasFinished} />
            </div>

            <div className="bottom-container">
                <div className="buttons">
                    <button onClick={v.modeSwap}>Changer de mode</button>
                    <button onClick={v.reset}>Reset</button>
                    <button onClick={v.initText}>Nouveau texte</button>
                    {(v.mpm) && <span>{v.mpm} mpm</span>}
                </div>

                <div className="infos">
                    <p>{v.mode}</p>
                </div>
            </div>
            <div className="scores">
                <h3>Mes scores en {v.mode.toLowerCase()} pour ce texte</h3>
                <table >
                    <tbody>
                        <tr>
                            <th>Position</th>
                            <th>Mots par minutes</th>
                            <th>Date</th>
                        </tr>
                        {v.scores.length > 0 ? scores : noScores}
                    </tbody>
                </table>
            </div>
            <p className="delete-scores" onClick={v.resetScores}>Effacer tous les scores</p>
        </div>;



    }
}

export default MainView;