import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useHistory
} from "react-router-dom";
import axios from 'axios'
import shuffle from 'lodash/shuffle'
import sortBy from 'lodash/sortBy'
import isEqual from 'lodash/isEqual'

export default function App() {
  const [globalState, setGlobalState] = useState(JSON.parse(localStorage.getItem('state')) || {
    player: {
      name: '',
      assertions: 0,
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
              <img data-testid="header-profile-picture" src="https://www.gravatar.com/avatar/2d3bf5b67282f5f466e503d702dabcf3"/>
              <div ><span data-testid="header-score">{state.player.name ? state.player.score : null}</span></div>
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
            <Route path="/feedback">
              <FeedbackPage setState={setState} state={state}/>
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

  const [email, setEmail] = useState('')
  const onChangePlayerEmail = (e) => {
    setEmail(e.target.value)
  }

  const goToGame = () => {

      axios({
        method: 'get',
        url: 'https://opentdb.com/api_token.php?command=request',
      })
          .then(function (response) {
            // setIsActive(true)
            // setQuestions(response.data.results)
            // setShuffled(shuffleAnswers(response.data.results[question]))
            debugger
            localStorage.setItem('token', response.data.token)
            history.push('/game')
          });
  }
  return <div style={{backgroundColor: '#CCC', height: 500}}>
    <h2>Nome do jogador:</h2>
    <input data-testid="input-player-name" onChange={onChangePlayerName} type="text" />
    <input data-testid="input-gravatar-email" onChange={onChangePlayerEmail} type="email" />
    <button data-testid="btn-play" disabled={!name || !email} onClick={() => {
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
    if (isActive && seconds > 0) {
      interval = setInterval(() => {
        setSeconds(seconds => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    } else {
      selectQuestion('')
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isActive, seconds])

  React.useEffect(() => {
    const token = localStorage.getItem('token')
    console.log(token)
    axios({
      method: 'get',
      url: `https://opentdb.com/api.php?amount=5&token=${token}`,
    })
        .then(function (response) {
          if(response.data.response_code == 3) {
            localStorage.clear()
            return history.push('/')
          }
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
    setIsActive(false)
    const correctIndex = shuffled.findIndex((e) => e === q.correct_answer)
    setCorrectIndex(correctIndex)
    if (a === q.correct_answer) {
      props.setState({
        ...props.state,
        player: {...props.state.player,
          score: props.state.player.score + calculatePoints(),
          assertions: props.state.player.assertions + 1}
      })
     return true
    }
    return false
  }

  const next = () => {
    setCorrectIndex(null)
    if (question === 4) {
      const ranking = JSON.parse(localStorage.getItem('ranking') || '[]')

      const newRanking = ranking.concat({
          name: props.state.player.name,
          score:props.state.player.score
      })
      localStorage.setItem('ranking', JSON.stringify(newRanking))
      return history.push('/feedback')
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
  let wrongAI = 0
  return (
      <div style={{backgroundColor: '#CCC', height: 500}}>
        <div data-testid="question-category">{q.category}</div>
        <div data-testid="question-text">
          {q.question}
        </div>
        <div>
          <ul>
            {shuffled.map((a, i) => {
              if(a !== q.correct_answer) {
                wrongAI = wrongAI + 1
              }
              return <li style={{color: correctIndex === null ? '' : i === correctIndex ? 'green' : 'red'}}>
                <button data-testid={a === q.correct_answer ? 'correct-answer' : `wrong-answer-${wrongAI}`} onClick={() => selectQuestion(a)}>{a}</button>
              </li>
            })}
          </ul>
        </div>
        <button onClick={() => next()} data-testid="btn-next">Proxima</button>
        <div >
          Tempo: <span data-testid="timer">{seconds}</span>
        </div>
      </div>
  )
}

function FeedbackPage(props) {
  const {player} = props.state
  const getMessage = () => {
    debugger
    if (player.assertions < 3 ) {
      return 'Podia ser melhor...'
    } else {
      return 'Mandou bem!'
    }
  }

  const message = getMessage()
  return (
      <div>
        <h2 data-testid="feedback-text">{message}</h2>
        <div>
          <span data-testid="feedback-total-question">
            Você acertou {player.assertions} questões!
          </span>
          <span data-testid="feedback-total-score">
            Um total de {player.score} pontos
          </span>
        </div>
        <div>
          <button data-testid="btn-ranking">ranking</button>
          <button data-testid="btn-play-again">jogar novamente</button>
        </div>
      </div>
  )

}

function Ranking(props) {
  const [ranking, setRanking] = useState([])
  React.useEffect(() => {
    const ranking = JSON.parse(localStorage.getItem('ranking'))
    setRanking(ranking)
  }, [])


  return <div>
    <h2>Ranking</h2>
    <div>{
      sortBy(ranking, ['score']).reverse().map((k, index) => {
        return <div key={k.name}><img data-testid={`profile-picture-${index + 1}`}/><span data-testid={`${k.name}-${index+1}`}>{k.name} - {k.score}</span></div>
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