// // import logo from './logo.svg';
// // import './App.css';

// // function App() {
// //   return (
// //     <div className="App">
// //       <header className="App-header">
// //         <img src={logo} className="App-logo" alt="logo" />
// //         <p>
// //           Edit <code>src/App.js</code> and save to reload.
// //         </p>
// //         <a
// //           className="App-link"
// //           href="https://reactjs.org"
// //           target="_blank"
// //           rel="noopener noreferrer"
// //         >
// //           Learn React
// //         </a>
// //       </header>
// //     </div>
// //   );
// // }

// // export default App;

// import React from 'react';
// import { Menu, Button } from 'antd';
// import { MailOutlined } from '@ant-design/icons';

// const App = () => {
//   const handleButtonClick = (key) => {
//     console.log(`Button with key ${key} clicked!`);
//     // Add your custom logic here
//   };
//   function handleClick(e) {
//   console.log('click', e);
// }

//   const items = [
//     {
//       key: '1',
//       label: 'Interviewee',
//     },
//     {
//       key: '2',
//       label: 'Interviewer',
//     },
//   ];

//   return (
//     <Menu onClick={handleClick}
//       style={{ width: 256 }}
//       defaultSelectedKeys={['1']}
//       mode="inline"
//       items={items}
//     />
//   );
// };

// export default App;

// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import './App.css'; // You can add custom styles here
//import PdfUploader from './PdfUploader';
import PdfList from './PDFList';
import PdfReaderAntd from "./components/PdfReader";
import TimedInterviewApp from "./components/interviewapp"
import "antd/dist/reset.css"; // AntD v5
const { Header, Content, Sider } = Layout;

const Interviewee = () => <div><h1> <PdfReaderAntd /></h1></div>;
const Interviewer = () => <div><h1><PdfList /></h1></div>;
const StartInterview = () => <div><h1><TimedInterviewApp /></h1></div>;

const App = () => {``
  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider breakpoint="lg" collapsedWidth="0">
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Link to="/interviewee">Interviewee</Link>
            </Menu.Item>
              <Menu.Item key="2">
              <Link to="/startInterview">Start Interview</Link>
            </Menu.Item>
            <Menu.Item key="3">
              <Link to="/interviewer">Interviewer</Link>
            </Menu.Item>
           </Menu>
        </Sider>
        <Layout>
          <Header style={{ padding: 0, background: '#fff' }} />
          <Content style={{ margin: '24px 16px 0' }}>
            <div style={{ padding: 24, background: '#fff', minHeight: 360 }}>
              <Routes>
                <Route path="/interviewee" element={<Interviewee />} />
                <Route path="/interviewer" element={<Interviewer />} />
                <Route path="/startInterview" element={<StartInterview />} />
              </Routes>
            </div>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;