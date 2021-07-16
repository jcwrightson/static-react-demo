import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";

// Testing
fetch("https://wf3wtsom40.execute-api.eu-west-1.amazonaws.com/product")
  .then((res) => res.json())
  .then(console.log);

const Page = () => (
  <header className="App-header">
    <img src="profile.jpg" alt="logo" />
    <p>
      Edit <code>src/App.js</code> and save to reload.
    </p>
    <a
      className="App-link"
      href="https://reactjs.org"
      target="_blank"
      rel="noopener noreferrer"
    >
      Learn React
    </a>
  </header>
);

const Routes = () => {
  return (
    <Switch>
      <Route path="/page">
        <Page />
      </Route>
      <Route path="/">
        <Page />
      </Route>
    </Switch>
  );
};
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes />
      </BrowserRouter>
    </div>
  );
}

export default App;
