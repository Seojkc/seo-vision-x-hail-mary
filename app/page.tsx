import Welcome from './Sections/welcome'
import Theory from './Sections/stringTheory'
import Introduction from './Sections/Introduction';
import GraceToDoor from './Sections/graceToDoor';
import  Funfacts from './Sections/funFacts';
import Skills from './Sections/Skills';
import Projects from './Sections/Projects';
import GithubSection from './Sections/github';
import Navbar from "./Sections/navbar";
import Contacts from "./Sections/Contacts";

export default function Home() {
  return (
    <div className='overflow-x-hidden gabriela-regular outer-body'>
      <div className="absolute inset-0 z-50">
        <Navbar />
      </div>

      <div data-navbar-theme="dark"><Welcome /></div>
      <div data-navbar-theme="dark"><Introduction /></div>
      <div data-navbar-theme="dark"><GraceToDoor /></div>
      <div data-navbar-theme="dark"  id="Projects"><Projects /></div>
      <div data-navbar-theme="light" id="Skills"><Skills /></div>
      <div data-navbar-theme="light"><Funfacts /></div>
      <div data-navbar-theme="light"><GithubSection /></div>
      <div data-navbar-theme="dark" id="Playgound"><Theory /></div>
      <div data-navbar-theme="dark" id="contact"><Contacts />  </div>

    </div>
  );
}