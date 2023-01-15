import { EthProvider } from "./contexts/EthContext";
import Header from "./components/Header";
import Content from "./components/Content"

function App() {
  return (
    <EthProvider>
      <div id="App" >
        <Header/>
        <Content/>
      </div>
    </EthProvider>
  );
}

export default App;
