import logo from './logo.svg';
import './App.css';
import Table from './components/table';
import { data, data2, data3} from './utils/data';

function App() {
  
let testData = `${data} + ${data2} + ${data3}`
  testData = testData.split('] + [').join(',');

  return (
    <div className="App">
      <Table rawData={testData} />
    </div>
  );
}

export default App;
