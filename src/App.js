import "./App.css";

// Testing
fetch("https://wf3wtsom40.execute-api.eu-west-1.amazonaws.com/product")
  .then((res) => res.json())
  .then(console.log);

function App() {
  return (
    <div className="App">
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
    </div>
  );
}

export default App;
