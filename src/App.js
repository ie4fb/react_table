import logo from './logo.svg';
import './App.css';
import Table from './components/table';
//import { data, data2, data3, data4} from './utils/data2';
import { data } from './utils/data';

function App() {
  
//let testData = `${data} + ${data2} + ${data3}`
 let testData = data

  return (
    <div className="App">
      <Table rawData={testData} />
    </div>
  );
}

export default App;
