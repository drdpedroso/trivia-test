import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useHistory
} from "react-router-dom";
import axios from 'axios'
import shuffle from 'lodash/shuffle'
import isEqual from 'lodash/isEqual'

export default function App() {
  const [globalState, setGlobalState] = useState(JSON.parse(localStorage.getItem('state')) || {
    player: {
      name: '',
      score: 0
    },
    config: {
      difficulty: '',
    }
  })

  const setState = (state) => {
    setGlobalState(state)
    localStorage.setItem('state', JSON.stringify(state))
    // localStorage.setItem('ranking', JSON.stringify(ranking))
  }

  const state = globalState
  return (
      <Router>
        <div>
          <nav>
            <ul>
              <div data-testid="header-player-name">{state.player.name}</div>
              <div data-testid="header-score">{state.player.name ? state.player.score : null}</div>
              {/*<li>*/}
              {/*  <Link to="/">Home</Link>*/}
              {/*</li>*/}
              {/*<li>*/}
              {/*  <Link to="/Game">Game</Link>*/}
              {/*</li>*/}
              {/*<li>*/}
              {/*  <Link to="/ranking">Ranking</Link>*/}
              {/*</li>*/}
            </ul>
          </nav>

          {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
          <Switch>
            <Route path="/game">
              <Game setState={setState} state={state}/>
            </Route>
            <Route path="/ranking">
              <Ranking setState={setState}/>
            </Route>
            <Route path="/">
              <Home setState={setState}/>
            </Route>
          </Switch>
        </div>
      </Router>
  );
}

function Home(props) {
  const history = useHistory()

  const [name, setName] = useState('')
  const onChangePlayerName = (e) => {
    setName(e.target.value)
  }

  const goToGame = () => {
    history.push('/game')
  }

  return <div style={{backgroundColor: '#CCC', height: 500}}>
    <h2>Nome do jogador:</h2>
    <input data-testid="input-player-name" onChange={onChangePlayerName} type="text" />
    <button data-testid="btn-play" onClick={() => {
      props.setState({
        ...props.state,
        player: {
          name,
          score: 0
        }
      })
      goToGame()
    }}>Jogar</button>
  </div>
}

function Game(props) {
  const history = useHistory()
  const [seconds, setSeconds] = useState(30);
  const [isActive, setIsActive] = useState(false);
  const [question, setQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [correctIndex, setCorrectIndex] = useState(null)
  const [shuffled, setShuffled] = useState([])

  React.useEffect(() => {
    let interval = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    } else if (seconds === 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds])

  React.useEffect(() => {
    axios({
      method: 'get',
      url: 'https://opentdb.com/api.php?amount=5',
    })
        .then(function (response) {
          setIsActive(true)
          setQuestions(response.data.results)
          setShuffled(shuffleAnswers(response.data.results[question]))
        });
  }, [])

  const q = questions[question] || {};
  React.useEffect(() => {
    // if (!isEqual(q, questions[question])) {
      setShuffled(shuffleAnswers(q))
    // }
  }, [question])


  const shuffleAnswers = (question = {}) => {
    try {
      return shuffle([...question.incorrect_answers, question.correct_answer] || [])
    } catch (e) {
      return []
    }
  }

  const selectQuestion = (a) => {
    // const correct = shuffled.filter((e, index) => e === q.correct_answer)
    setIsActive(false)
    const correctIndex = shuffled.findIndex((e) => e === q.correct_answer)
    setCorrectIndex(correctIndex)
    if (a === q.correct_answer) {
      props.setState({
        ...props.state,
        player: {...props.state.player, score: props.state.player.score + calculatePoints()}
      })
     return true
    }
    return false
  }

  const next = () => {
    setCorrectIndex(null)
    if (question === 4) {
      const ranking = JSON.parse(localStorage.getItem('ranking') || '{}')
      const newRanking = {...ranking, [props.state.player.name]: props.state.player.score}
      localStorage.setItem('ranking', JSON.stringify(newRanking))
      return history.push('/ranking')
    }
    setIsActive(true)
    setQuestion(question + 1)
    setSeconds(30)
  }

  const difficultMap = {
    hard: 3,
    medium: 2,
    easy: 1
  }

  const calculatePoints = () => {
    return Number(10 + seconds + difficultMap[q.difficulty])
  }

  return (
      <div style={{backgroundColor: '#CCC', height: 500}}>
        <div>{q.category}</div>
        <div>
          {q.question}
        </div>
        <div>
          <ul>
            {shuffled.map((a, i) => {
              return <li style={{color: correctIndex === null ? '' : i === correctIndex ? 'green' : 'red'}}><button onClick={() => selectQuestion(a)}>{a}</button></li>
            })}
          </ul>
        </div>
        <button onClick={() => next()}>Proxima</button>
        <div>
          Tempo: {seconds}
        </div>
      </div>
  )
}

function Ranking(props) {
  const [ranking, setRanking] = useState({})
  React.useEffect(() => {
    const ranking = JSON.parse(localStorage.getItem('ranking'))
    setRanking(ranking)
  }, [])


  return <div>
    <h2>Ranking</h2>
    <div>{
      Object.keys(ranking).map((k) => {
        return <div key={k}>{k} - {ranking[k]}</div>
      })
    }</div>

  </div>;
}

function Config(props) {
  const [ranking, setRanking] = useState({})
  React.useEffect(() => {
    const ranking = JSON.parse(localStorage.getItem('ranking'))
    setRanking(ranking)
  }, [])


  return <div>
    <h2>Ranking</h2>
    <div>{
      Object.keys(ranking).map((k) => {
        return <div key={k}>{k} - {ranking[k]}</div>
      })
    }</div>

  </div>;
}