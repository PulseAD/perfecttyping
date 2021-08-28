import React, { Component } from 'react';
import './App.css';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Home from "./components/Home";
import SoloTyping from './components/SoloTyping';

class App extends Component {
  render() {
    return <div className="App">
          <Router>
              <div>
                <nav>
                  <ul>
                    <li>
                      <Link to="/">Perfect Typing</Link>
                    </li>
                    {/* <li>
                      <Link to="/troll">Troll</Link>
                    </li> */}
                  </ul>
                </nav>
                <section>
                  <Route path="/" exact component={SoloTyping} />
                  <Route path="/troll" component={Home} />
                </section>
              </div>
          </Router>
      </div>;
  }
}

export default App;
