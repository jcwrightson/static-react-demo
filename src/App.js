import { BrowserRouter, NavLink, Route, Switch } from "react-router-dom";
import "./App.css";

// Testing
fetch("https://wf3wtsom40.execute-api.eu-west-1.amazonaws.com/product")
  .then((res) => res.json())
  .then(console.log);

const Page = ({ title }) => (
  <header className="App-header">
    <h1>{title}</h1>
    <nav>
      <NavLink to={"/"}>Home</NavLink>
      <NavLink to={"/page"}>Page #1</NavLink>
    </nav>
    <img src="profile.jpg" alt="logo" />
  </header>
);

const Routes = () => {
  return (
    <Switch>
      <Route path="/page">
        <Page title="Another Page" />
      </Route>
      <Route path="/">
        <Page title="Home" />
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
